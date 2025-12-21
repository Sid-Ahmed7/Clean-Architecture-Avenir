import { QuickTransfer } from "../../requests/QuickTransfer";
import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { UnauthorizedAccessError } from "../../errors/UnauthorizedAccessError";
import { TransactionTypeEnum } from "../../../domain/enums/TransactionTypeEnum";
import { TransferStatusEnum } from "../../../domain/enums/TransferStatusEnum";

export class QuickTransferUseCase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
  ) {}

  public async execute(data: QuickTransfer): Promise<TransactionEntity | AccountNotFoundError | UnauthorizedAccessError | InsufficientFundsError | Error> {
  
    const sourceAccount = await this.accountRepository.getOneAccountByAccountNumber(data.sourceAccountNumber);
    if (sourceAccount instanceof Error) {
      return new AccountNotFoundError(`Source account ${data.sourceAccountNumber} not found`);
    }

    if (sourceAccount.userId !== data.userId) {
      return new UnauthorizedAccessError("Unauthorized: Account does not belong to user");
    }

    const destinationAccount = await this.accountRepository.getOneAccountByAccountNumber(data.destinationAccountNumber);
    if (destinationAccount instanceof Error) {
      return new AccountNotFoundError(`Destination account ${data.destinationAccountNumber} not found`);
    }

    if (sourceAccount.currentBalance < data.amount) {
      return new InsufficientFundsError(`Insufficient funds. Required: ${data.amount}, Available: ${sourceAccount.currentBalance}`
      );
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
      await this.accountRepository.updateOneAccount(sourceAccount);
      return destinationUpdate;
    }

    const transactionReference = this.uuidService.generate();
    const transaction = TransactionEntity.from(
      transactionReference,
      sourceAccount.accountNumber,
      destinationAccount.accountNumber,
      data.amount,
      TransactionTypeEnum.TRANSFER,
      data.userId,
      TransferStatusEnum.PENDING,
      new Date(),
      undefined,
      undefined,
      undefined,
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
