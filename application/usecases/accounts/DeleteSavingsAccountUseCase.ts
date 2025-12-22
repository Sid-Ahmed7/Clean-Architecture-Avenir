import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { NoCheckingAccountForTransferError } from "../../errors/NoCheckingAccountForTransferError";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";

export class DeleteSavingsAccountUseCase {
    public constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface
    ) {}
    
    public async execute(accountNumber: number): Promise<void | Error> {
        // 1. Récupérer le compte d'épargne
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(accountNumber);
        if (savingsAccount instanceof Error) return savingsAccount;

        // 2. Si balance > 0, transférer vers un compte CHECKING
        if (savingsAccount.balance > 0) {
            const userAccounts = await this.accountRepository.getAccountsByUserId(savingsAccount.userId);
            if (userAccounts instanceof Error) return userAccounts;
            
            const checkingAccount = userAccounts.find(acc => acc.accountType === AccountTypeEnum.CHECKING);
            
            if (!checkingAccount) {
                return new NoCheckingAccountForTransferError(
                    "No checking account found to transfer the savings balance."
                );
            }

            // Transférer le solde
            const creditResult = checkingAccount.credit(savingsAccount.balance);
            if (creditResult instanceof Error) return creditResult;

            await this.accountRepository.updateOneAccount(checkingAccount);
            
            // Mettre le solde du compte épargne à 0
            savingsAccount.balance = 0;
            await this.savingsAccountRepository.updateSavingsAccount(savingsAccount);
        }

        // 3. Supprimer le compte d'épargne
        return await this.savingsAccountRepository.deleteSavingsAccount(accountNumber);
    }
}
