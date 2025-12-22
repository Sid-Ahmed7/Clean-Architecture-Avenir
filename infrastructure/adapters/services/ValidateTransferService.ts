import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { TransferValidationService } from "../../../application/ports/services/TransferValidationService";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { InsufficientFundsError } from "../../../application/errors/InsufficientFundsError";
import { TransferLimitExceededError } from "../../../application/errors/TransferLimitExceededError";
import { TransferLimitService } from "../../../application/ports/services/TransferLimitService";

export class ValidateTransferService implements TransferValidationService {

    constructor(private transferLimitService: TransferLimitService) {}

    validateTransfer(
        debitAccount: AccountEntity,
        creditAccount: AccountEntity,
        amount: number,
        userId: string
    ): Error | null {

        if (debitAccount.iban === creditAccount.iban) {
            return new InvalidAccountError("Cannot transfer to the same account");
        }

        if (debitAccount.userId !== userId) {
            return new InvalidAccountError("The source account does not belong to the user");
        }

        if (creditAccount.userId !== userId) {
            return new InvalidAccountError("The destination account does not belong to the user. Use beneficiary transfer instead.");
        }

        if (!debitAccount.isActive || !creditAccount.isActive) {
            return new InvalidAccountError("Both accounts must be active");
        }

        if (debitAccount.currency !== creditAccount.currency) {
            return new InvalidAccountError("Accounts must have the same currency");
        }

        if (!this.transferLimitService.canTransfer(debitAccount, amount)) {
            const remaining = this.transferLimitService.getRemainingLimit(debitAccount);
            return new TransferLimitExceededError(
                `Transfer limit exceeded. Remaining: ${remaining} ${debitAccount.currency}`
            );
        }

        const availableFunds = debitAccount.currentBalance + debitAccount.overdraftLimit;
        if (amount > availableFunds) {
            return new InsufficientFundsError("Insufficient funds");
        }

        return null;
    }
}
