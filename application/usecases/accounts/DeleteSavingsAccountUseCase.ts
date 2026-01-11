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
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(accountNumber);
        if (savingsAccount instanceof Error) return savingsAccount;

        if (savingsAccount.balance > 0) {
            const userAccounts = await this.accountRepository.getAccountsByUserId(savingsAccount.userId);
            if (userAccounts instanceof Error) return userAccounts;
            
            const checkingAccount = userAccounts.find(acc => acc.accountType === AccountTypeEnum.CHECKING);
            
            if (!checkingAccount) {
                return new NoCheckingAccountForTransferError(
                    "No checking account found to transfer the savings balance."
                );
            }

            const creditResult = checkingAccount.credit(savingsAccount.balance);
            if (creditResult instanceof Error) return creditResult;

            await this.accountRepository.updateOneAccount(checkingAccount);
            
            savingsAccount.balance = 0;
            await this.savingsAccountRepository.updateSavingsAccount(savingsAccount);
        }

        return await this.savingsAccountRepository.deleteSavingsAccount(accountNumber);
    }
}
