import { SavingsAccountRepositoryInterface } from "../../../application/ports/repositories/SavingsAccountRepositoryInterface";
import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { AccountNotFoundError } from "../../../application/errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";

export class InMemorySavingsAccountRepository implements SavingsAccountRepositoryInterface {
    
    private savingsAccounts: Array<SavingsAccountsEntity>;

    public constructor() {
        this.savingsAccounts = [];
    }

    public async createSavingsAccount(savingsAccount: SavingsAccountsEntity): Promise<SavingsAccountsEntity | InvalidAccountError> {
        if (!savingsAccount) {
            return new InvalidAccountError("Savings account data is invalid");
        }

        const existing = this.savingsAccounts.find(acc => acc.accountNumber === savingsAccount.accountNumber);
        if (existing) {
            return new InvalidAccountError(`Savings account with number ${savingsAccount.accountNumber} already exists`);
        }

        this.savingsAccounts.push(savingsAccount);
        return savingsAccount;
    }

    public async getSavingsAccountByNumber(accountNumber: number): Promise<SavingsAccountsEntity | AccountNotFoundError> {
        const savingsAccount = this.savingsAccounts.find(acc => acc.accountNumber === accountNumber);
        
        if (!savingsAccount) {
            return new AccountNotFoundError(`Savings account with number ${accountNumber} not found`);
        }

        return savingsAccount;
    }

    public async getSavingsAccountsWithActiveInterest(): Promise<Array<SavingsAccountsEntity>> {
        return this.savingsAccounts.filter(acc => acc.isActive);
    }

    public async getSavingsAccountsByUserId(userId: string): Promise<SavingsAccountsEntity[] | Error> {
        const userSavingsAccounts = this.savingsAccounts.filter(acc => acc.userId === userId);
        return userSavingsAccounts;
    }

    public async updateSavingsAccount(savingsAccount: SavingsAccountsEntity): Promise<SavingsAccountsEntity | AccountNotFoundError | InvalidAccountError> {
        const index = this.savingsAccounts.findIndex(acc => acc.accountNumber === savingsAccount.accountNumber);
        
        if (index === -1) {
            return new AccountNotFoundError(`Savings account with number ${savingsAccount.accountNumber} not found`);
        }

        if (!savingsAccount) {
            return new InvalidAccountError("Savings account data is invalid");
        }

        this.savingsAccounts[index] = savingsAccount;
        return savingsAccount;
    }

    public async getAllSavingsAccounts(): Promise<Array<SavingsAccountsEntity>> {
        return this.savingsAccounts;
    }

    public async deleteSavingsAccount(accountNumber: number): Promise<void | AccountNotFoundError> {
        const index = this.savingsAccounts.findIndex(acc => acc.accountNumber === accountNumber);
        
        if (index === -1) {
            return new AccountNotFoundError(`Savings account with number ${accountNumber} not found`);
        }

        this.savingsAccounts.splice(index, 1);
    }
}
