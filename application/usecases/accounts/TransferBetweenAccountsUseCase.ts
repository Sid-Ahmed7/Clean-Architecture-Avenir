import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";
import { OrderStatusEnum } from "../../../domain/enums/OrderStatusEnum";
import { TransactionTypeEnum } from "../../../domain/enums/TransactionTypeEnum";
import { TransferInput } from "../../requests/TransferInput"
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { TransferLimitService } from "../../ports/services/TransferLimitService";
import { TransferValidationService } from "../../ports/services/TransferValidationService";


export class TransferBetweenAccountsUseCase {
    public constructor(
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly transactionRepository: TransactionRepositoryInterface,
        private readonly uuidService: UuidGeneratorService,
        private readonly transferLimitService: TransferLimitService,
        private readonly transferValidationService: TransferValidationService
    ) {}

    public async execute(input: TransferInput) {
        const { fromIban, toIban, amount, userId } = input;

        const debitAccount = await this.accountRepository.getOneAccountByIban(fromIban);
        if (debitAccount instanceof AccountNotFoundError) {
            return debitAccount;
        }

        const creditAccount = await this.accountRepository.getOneAccountByIban(toIban);
        if (creditAccount instanceof AccountNotFoundError) {
            return creditAccount;
        }

        const validationError = this.transferValidationService.validateTransfer(
            debitAccount,
            creditAccount,
            amount,
            userId
        );

        if (validationError) {
            return validationError;
        }

        debitAccount.updateBalance(debitAccount.currentBalance - amount);
        creditAccount.updateBalance(creditAccount.currentBalance + amount);

        this.transferLimitService.recordTransfer(debitAccount, amount);

        const debitUpdate = await this.accountRepository.updateOneAccount(debitAccount);
        if (debitUpdate instanceof Error) {
            return debitUpdate;
        }

        const creditUpdate = await this.accountRepository.updateOneAccount(creditAccount);
        if (creditUpdate instanceof Error) {
            return creditUpdate;
        }

        const reference = this.uuidService.generate();

        const transactionOrError = TransactionEntity.from(
            reference,
            debitAccount.accountNumber,
            creditAccount.accountNumber,
            amount,
            TransactionTypeEnum.TRANSFER,
            userId,
            OrderStatusEnum.COMPLETED,
            new Date()
        );

        if (!(transactionOrError instanceof TransactionEntity)) {
            return transactionOrError;
        }

        transactionOrError.debitUserId = debitAccount.userId;
        transactionOrError.creditUserId = creditAccount.userId;

        await this.transactionRepository.save(transactionOrError);

        return {
            fromAccount: debitUpdate,
            toAccount: creditUpdate,
        };
    }
}

