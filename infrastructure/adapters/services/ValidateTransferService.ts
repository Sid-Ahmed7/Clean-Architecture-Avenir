import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { TransferValidationService } from "../../../application/ports/services/TransferValidationService";
import { SavingsExternalTransferError } from "../../../application/errors/SavingsExternalTransferError";

export class ValidateTransferService implements TransferValidationService {

    validateTransfer(debitAccount: AccountEntity,creditAccount: AccountEntity,amount: number,userId: string): Error | null {
        if (debitAccount.userId !== userId) {
            return new Error("Le compte débiteur n'appartient pas à l'utilisateur");
        }

        if (debitAccount.currentBalance < amount) {
            return new Error("Solde insuffisant");
        }

        return null;
    }
}
