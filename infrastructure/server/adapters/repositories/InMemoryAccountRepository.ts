import { AccountRepositoryInterface } from "../../../../application/repositories/AccountRepositoryInterface";
import { AccountEntity } from "../../../../domain/entities/AccountEntity";
import { AccountStatusEnum } from "../../../../domain/enums/AccountStatusEnum";
import { AccountTypeEnum } from "../../../../domain/enums/AccountTypeEnum";
import { AccountAlreadyExistsError } from "../../../../domain/errors/AccountAlreadyExistsError";
import { AccountNotFoundError } from "../../../../domain/errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../../domain/errors/InvalidAccountError";
import { AccountNumberValue } from "../../../../domain/values/AccountNumberValue";
import { IbanValue } from "../../../../domain/values/IbanValue";

export class InMemoryAccountRepository implements AccountRepositoryInterface {

    private accounts: Array<AccountEntity>;

    public constructor() {
        const firstUserId = crypto.randomUUID();
        const secondUserId = crypto.randomUUID();

        const firstAccountNumber = AccountNumberValue.generateAccountNumber()
        const secondAccountNumber = AccountNumberValue.generateAccountNumber()
        if (firstAccountNumber instanceof Error) throw firstAccountNumber;
        if (secondAccountNumber instanceof Error) throw secondAccountNumber
        
        const firstAccountIban = IbanValue.generateIban(firstAccountNumber.value);
        const secondAccountIban = IbanValue.generateIban(secondAccountNumber.value);
;
        if (firstAccountIban instanceof Error) throw firstAccountIban;
        if (secondAccountIban instanceof Error) throw secondAccountIban;


        const firstAccount = AccountEntity.from(
            firstAccountNumber.value,
            firstAccountIban.value,
            firstUserId,
            AccountTypeEnum.CHECKING,
            "EUR",
            AccountStatusEnum.ACTIVE,
            true,
            20250,
            new Date(),
            1000,
            2000,
            500,
            "Compte principal",
            "Mr.Directeur"
        )

        const secondAccount = AccountEntity.from(
            secondAccountNumber.value,
            secondAccountIban.value,
            secondUserId,
            AccountTypeEnum.CREDIT,
            "USD",
            AccountStatusEnum.ACTIVE,
            true,
            540000,
            new Date(),
            2000,
            3000,
            1000,
            "Compte principal",
            "Mr.Directeur"
        )

        if (firstAccount instanceof Error || secondAccount instanceof Error ) {
            throw new Error("Bad initialization of account")
        }

        this.accounts = [firstAccount, secondAccount]
    }

    public async getOneAccountByAccountNumber(accountNumber: number): Promise<AccountEntity | AccountNotFoundError> {
        const account = this.accounts.find((acc) =>  acc.accountNumber === accountNumber);
        if(!account) {
            return new AccountNotFoundError(`Account with number ${accountNumber} is not found`);
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