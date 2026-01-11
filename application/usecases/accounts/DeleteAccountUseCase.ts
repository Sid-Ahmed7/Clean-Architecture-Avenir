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
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);
        if (account instanceof Error) return account;

        const userAccounts = await this.accountRepository.getAccountsByUserId(account.userId);
        if (userAccounts instanceof Error) return userAccounts;

        const checkingAccounts = userAccounts.filter(acc => acc.accountType === AccountTypeEnum.CHECKING);

        if (account.accountType === AccountTypeEnum.CHECKING) {
            return new CannotDeleteLastCheckingAccountError(
                "Cannot delete a checking account. Only sub-accounts can be deleted."
            );
        }

        if (account.currentBalance > 0) {
            const destinationAccount = checkingAccounts.find(acc => acc.accountNumber !== accountNumber);
            
            if (!destinationAccount) {
                return new NoCheckingAccountForTransferError(
                    "No checking account found to transfer the balance before deletion."
                );
            }

            const creditResult = destinationAccount.credit(account.currentBalance);
            if (creditResult instanceof Error) return creditResult;

            const debitResult = account.debit(account.currentBalance);
            if (debitResult instanceof Error) return debitResult;

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

        return await this.accountRepository.deleteAccount(accountNumber);
    }
}
 