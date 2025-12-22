import { TransferToGroup } from "../../requests/TransferToGroup";
import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { BeneficiaryRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { BeneficiaryGroupRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";
import { BeneficiaryNotFoundError } from "../../errors/BeneficiaryNotFoundError";
import { BeneficiaryGroupNotFoundError } from "../../errors/BeneficiaryGroupNotFoundError";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { UnauthorizedAccessError } from "../../errors/UnauthorizedAccessError";
import { TransactionTypeEnum } from "../../../domain/enums/TransactionTypeEnum";
import { TransferStatusEnum } from "../../../domain/enums/TransferStatusEnum";
import { TransferToGroupResult } from "../../responses/TransferToGroupResult";

export class TransferToGroupUseCase {
  public constructor(
    private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface,
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
  ) {}

  public async execute(
    data: TransferToGroup
  ): Promise<TransferToGroupResult | BeneficiaryGroupNotFoundError | AccountNotFoundError | UnauthorizedAccessError | InsufficientFundsError | BeneficiaryNotFoundError> {
    const group = await this.beneficiaryGroupRepository.getById(data.groupId);

    if (group instanceof Error) {
      return group;
    }

    if (group.userId !== data.userId) {
      return new UnauthorizedAccessError("Unauthorized: Beneficiary group does not belong to user");
    }

    const sourceAccount = await this.accountRepository.getOneAccountByAccountNumber(data.sourceAccountNumber);
    if (sourceAccount instanceof Error) {
      return sourceAccount;
    }

    if (sourceAccount.userId !== data.userId) {
      return new UnauthorizedAccessError("Unauthorized: Account does not belong to user");
    }

    const totalAmount = data.amountPerBeneficiary * group.beneficiaryIds.length;

    if (sourceAccount.currentBalance < totalAmount) {
      return new InsufficientFundsError(`Insufficient funds. Required: ${totalAmount}, Available: ${sourceAccount.currentBalance}`);
    }

    const result: TransferToGroupResult = {
      successfulTransfers: [],
    };

    for (const beneficiaryId of group.beneficiaryIds) {
      const beneficiary = await this.beneficiaryRepository.getById(beneficiaryId);
      if (beneficiary instanceof Error) {
        return beneficiary;
      }

      const destinationAccount = await this.accountRepository.getOneAccountByIban(beneficiary.iban);
      if (destinationAccount instanceof Error) {
        return destinationAccount;
      }

      const currentSourceAccount = await this.accountRepository.getOneAccountByAccountNumber(data.sourceAccountNumber);
      if (currentSourceAccount instanceof Error) {
        return currentSourceAccount;
      }

      if (currentSourceAccount.currentBalance < data.amountPerBeneficiary) {
        return new InsufficientFundsError(`Insufficient funds for transfer to beneficiary ${beneficiaryId}`);
      }

      const originalSourceBalance = currentSourceAccount.currentBalance;
      const originalDestinationBalance = destinationAccount.currentBalance;

      currentSourceAccount.updateBalance(currentSourceAccount.currentBalance - data.amountPerBeneficiary);
      destinationAccount.updateBalance(destinationAccount.currentBalance + data.amountPerBeneficiary);

      const sourceUpdate = await this.accountRepository.updateOneAccount(currentSourceAccount);
      if (sourceUpdate instanceof Error) {
        currentSourceAccount.updateBalance(originalSourceBalance);
        return sourceUpdate;
      }

      const destinationUpdate = await this.accountRepository.updateOneAccount(destinationAccount);
      if (destinationUpdate instanceof Error) {
        currentSourceAccount.updateBalance(originalSourceBalance);
        await this.accountRepository.updateOneAccount(currentSourceAccount);
        return destinationUpdate;
      }

      const transactionReference = this.uuidService.generate();
      const transaction = TransactionEntity.from(
        transactionReference,
        currentSourceAccount.accountNumber,
        destinationAccount.accountNumber,
        data.amountPerBeneficiary,
        TransactionTypeEnum.BENEFICIARY,
        data.userId,
        TransferStatusEnum.PENDING,
        new Date(),
        beneficiary.beneficiaryName,
        undefined,
        beneficiaryId,
        data.groupId
      );

      if (!(transaction instanceof TransactionEntity)) {
        currentSourceAccount.updateBalance(originalSourceBalance);
        destinationAccount.updateBalance(originalDestinationBalance);
        await this.accountRepository.updateOneAccount(currentSourceAccount);
        await this.accountRepository.updateOneAccount(destinationAccount);
        return transaction;
      }

      transaction.debitUserId = currentSourceAccount.userId;
      transaction.creditUserId = destinationAccount.userId;

      await this.transactionRepository.save(transaction);

      currentSourceAccount.recordTransfer(data.amountPerBeneficiary);
      await this.accountRepository.updateOneAccount(currentSourceAccount);

      transaction.complete();
      await this.transactionRepository.save(transaction);

      result.successfulTransfers.push(transaction);
    }

    return result;
  }
}
