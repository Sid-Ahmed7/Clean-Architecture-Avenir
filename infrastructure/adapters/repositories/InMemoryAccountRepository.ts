
import { AccountRepositoryInterface } from "../../../application/ports/repositories/AccountRepositoryInterface";
import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountAlreadyExistsError } from "../../../application/errors/AccountAlreadyExistsError";
import { AccountNotFoundError } from "../../../application/errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";


export class InMemoryAccountRepository implements AccountRepositoryInterface {

    private accounts: Array<AccountEntity>;

    public constructor() {
        this.accounts = []
    }

    public async getOneAccountByAccountNumber(accountNumber: number): Promise<AccountEntity | AccountNotFoundError> {
        const account = this.accounts.find((acc) =>  acc.accountNumber === accountNumber);
        if(!account) {
            return new AccountNotFoundError(`Account with number ${accountNumber} is not found`);
        }

        return account;
    }

    public async getOneAccountByIban(iban: string): Promise<AccountEntity | AccountNotFoundError> {
        const account = this.accounts.find(acc => acc.iban === iban);
        if (!account) {
            return new AccountNotFoundError(`Account with IBAN ${iban} is not found`);
        }
        return account;
    
    }

    public async getAllAccounts(): Promise<Array<AccountEntity>> {
        return this.accounts;
    }

    public async createOneAccount(account: AccountEntity): Promise<AccountEntity | AccountAlreadyExistsError | InvalidAccountError> {
        const actualAccount = this.accounts.find((acc) =>  acc.accountNumber === account.accountNumber);

        if(actualAccount) {
            return new AccountAlreadyExistsError(`Account with number ${account.accountNumber} already exists`);
        }

        if(!account) {
            return new InvalidAccountError("Account data is invalid")
        }

        this.accounts.push(account);
        return account;
    }
    
    public async updateOneAccount(account: AccountEntity): Promise<AccountEntity | AccountNotFoundError | InvalidAccountError> {
        const index = this.accounts.findIndex((acc) => acc.accountNumber === account.accountNumber)
        
        if(index === -1) {
            return new AccountNotFoundError(`Account with number ${account.accountNumber} is not found`);
        }
        
        if(!account) {
            return new InvalidAccountError("Account data is invalid")
        }

         this.accounts[index] = account;
        return account;
    }

    public async deleteAccount(accountNumber: number): Promise<void | AccountNotFoundError> {
        const index = this.accounts.findIndex((acc) => acc.accountNumber === accountNumber)
        
        if(index === -1) {
            return new AccountNotFoundError(`Account with number ${accountNumber} is not found`);
        }
        
        this.accounts.splice(index, 1);   
    }

}