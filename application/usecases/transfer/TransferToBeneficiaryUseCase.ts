import { TransferToBeneficiary } from "../../requests/TransferToBeneficiary";
import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { BeneficiaryRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";
import { BeneficiaryNotFoundError } from "../../errors/BeneficiaryNotFoundError";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { UnauthorizedAccessError } from "../../errors/UnauthorizedAccessError";
import { TransactionTypeEnum } from "../../../domain/enums/TransactionTypeEnum";
import { TransferStatusEnum } from "../../../domain/enums/TransferStatusEnum";

export class TransferToBeneficiaryUseCase {
  public constructor(
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
  ) {}

  public async execute(data: TransferToBeneficiary): Promise<TransactionEntity | BeneficiaryNotFoundError | AccountNotFoundError | InsufficientFundsError | UnauthorizedAccessError | Error> {
    const beneficiary = await this.beneficiaryRepository.getById(data.beneficiaryId);

    if (beneficiary instanceof Error) {
      return beneficiary;
    }

    if (beneficiary.userId !== data.userId) {
      return new UnauthorizedAccessError("Unauthorized: Beneficiary does not belong to user");
    }

    const sourceAccount = await this.accountRepository.getOneAccountByAccountNumber(data.sourceAccountNumber);
    if (sourceAccount instanceof Error) {
      return sourceAccount;
    }

    if (sourceAccount.userId !== data.userId) {
      return new UnauthorizedAccessError("Unauthorized: Account does not belong to user");
    }

    const destinationAccount = await this.accountRepository.getOneAccountByIban(beneficiary.iban);
    if (destinationAccount instanceof Error) {
      return destinationAccount;
    }

    const originalSourceBalance = sourceAccount.currentBalance;
    const originalDestinationBalance = destinationAccount.currentBalance;

    sourceAccount.updateBalance(sourceAccount.currentBalance - data.amount);
    destinationAccount.updateBalance(destinationAccount.currentBalance + data.amount);

    const sourceUpdate = await this.accountRepository.updateOneAccount(sourceAccount);
    if (sourceUpdate instanceof Error) {
      sourceAccount.updateBalance(originalSourceBalance);
      return sourceUpdate;
    }

    const destinationUpdate = await this.accountRepository.updateOneAccount(destinationAccount);
    if (destinationUpdate instanceof Error) {
      sourceAccount.updateBalance(originalSourceBalance);
      const rollbackResult = await this.accountRepository.updateOneAccount(sourceAccount);

      if (rollbackResult instanceof Error) {
        return rollbackResult;
      }

      return destinationUpdate;
    }

    const transactionReference = this.uuidService.generate();
    const transaction = TransactionEntity.from(
      transactionReference,
      sourceAccount.accountNumber,
      destinationAccount.accountNumber,
      data.amount,
      TransactionTypeEnum.BENEFICIARY,
      data.userId,
      TransferStatusEnum.PENDING,
      new Date(),
      beneficiary.beneficiaryName,
      undefined,
      data.beneficiaryId,
      undefined
    );

    if (!(transaction instanceof TransactionEntity)) {
      sourceAccount.updateBalance(originalSourceBalance);
      destinationAccount.updateBalance(originalDestinationBalance);
      await this.accountRepository.updateOneAccount(sourceAccount);
      await this.accountRepository.updateOneAccount(destinationAccount);
      return transaction;
    }

    transaction.debitUserId = sourceAccount.userId;
    transaction.creditUserId = destinationAccount.userId;

    await this.transactionRepository.save(transaction);

    sourceAccount.recordTransfer(data.amount);
    await this.accountRepository.updateOneAccount(sourceAccount);

    transaction.complete();
    await this.transactionRepository.save(transaction);

    return transaction;
  }
}
