import { AccountEntity } from "../entities/AccountEntity";
import { InvalidAccountError } from "../errors/InvalidAccountError";
import { InsufficientFundsError } from "../../application/errors/InsufficientFundsError";
import { TransferLimitExceededError } from "../../application/errors/TransferLimitExceededError";
import { SavingsExternalTransferError } from "../../application/errors/SavingsExternalTransferError";
import { TransferLimitServiceInterface } from "../../application/ports/services/TransferLimitServiceInterface";
import { TransferValidationServiceInterface } from "../../application/ports/services/TransferValidationServiceInterface";
import { AccountTypeEnum } from "../enums/AccountTypeEnum";

export class TransferValidationService implements TransferValidationServiceInterface {
    constructor(private transferLimitService: TransferLimitServiceInterface) {}

    public validateTransfer(
        debitAccount: AccountEntity,
        creditAccount: AccountEntity,
        amount: number,
        userId: string
    ): Error | null {
        if (debitAccount.iban === creditAccount.iban) {
            return new InvalidAccountError("Cannot transfer to the same account");
        }

        if (debitAccount.userId !== userId) {
            return new InvalidAccountError("Source account does not belong to this user");
        }

        if (!debitAccount.isActive || !creditAccount.isActive) {
            return new InvalidAccountError("Both accounts must be active");
        }

        if (debitAccount.currency !== creditAccount.currency) {
            return new InvalidAccountError("Accounts must use the same currency");
        }

        if (!this.transferLimitService.canTransfer(debitAccount, amount)) {
            const remaining = this.transferLimitService.getRemainingLimit(debitAccount);
            return new TransferLimitExceededError(
                `Transfer limit exceeded. Available: ${remaining} ${debitAccount.currency}`
            );
        }

        const availableFunds = debitAccount.currentBalance + debitAccount.overdraftLimit;
        if (amount > availableFunds) {
            return new InsufficientFundsError("Insufficient funds");
        }

        return null;
    }
}
