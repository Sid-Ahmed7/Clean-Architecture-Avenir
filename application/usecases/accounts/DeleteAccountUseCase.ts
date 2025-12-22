import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";
import { CannotDeleteLastCheckingAccountError } from "../../errors/CannotDeleteLastCheckingAccountError";
import { NoCheckingAccountForTransferError } from "../../errors/NoCheckingAccountForTransferError";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";

export class DeleteAccountUseCase {
    public constructor (
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ){}
    
    public async execute(accountNumber: number): Promise<void | Error> {
        // 1. Récupérer le compte à supprimer
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);
        if (account instanceof Error) return account;

        // 2. Récupérer tous les comptes de l'utilisateur
        const userAccounts = await this.accountRepository.getAccountsByUserId(account.userId);
        if (userAccounts instanceof Error) return userAccounts;
        
        const checkingAccounts = userAccounts.filter(acc => acc.accountType === AccountTypeEnum.CHECKING);

        // 3. Si CHECKING, vérifier qu'il n'est pas le dernier OU que son solde est 0
        if (account.accountType === AccountTypeEnum.CHECKING) {
            if (checkingAccounts.length === 1) {
                // Exception : autoriser si le solde est 0€
                if (account.currentBalance > 0) {
                    return new CannotDeleteLastCheckingAccountError(
                        "Cannot delete the last checking account with a positive balance. Please transfer funds first or ensure balance is 0€."
                    );
                }
                // Si balance === 0, on peut supprimer (pas besoin de transfert)
                return await this.accountRepository.deleteAccount(accountNumber);
            }
        }

        // 4. Transférer le solde si > 0
        if (account.currentBalance > 0) {
            // Trouver un compte CHECKING de destination (différent du compte à supprimer)
            const destinationAccount = checkingAccounts.find(acc => acc.accountNumber !== accountNumber);
            
            if (!destinationAccount) {
                return new NoCheckingAccountForTransferError(
                    "No checking account found to transfer the balance before deletion."
                );
            }

            // Créditer le compte de destination
            const creditResult = destinationAccount.credit(account.currentBalance);
            if (creditResult instanceof Error) return creditResult;

            // Débiter le compte à supprimer
            const debitResult = account.debit(account.currentBalance);
            if (debitResult instanceof Error) return debitResult;

            // Mettre à jour les deux comptes
            await this.accountRepository.updateOneAccount(destinationAccount);
            await this.accountRepository.updateOneAccount(account);
        }

        if (this.sendNotificationUseCase ) {
            await this.sendNotificationUseCase.execute(
                account.userId,
                `Votre compte a été supprimé.`,
                NotificationTypeEnum.INFO
            );
        }

        // 5. Supprimer le compte (maintenant avec solde = 0)
        return await this.accountRepository.deleteAccount(accountNumber);
    }
}
 