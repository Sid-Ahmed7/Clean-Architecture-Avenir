import { AccountNotFoundError } from "../../../domain/errors/AccountNotFoundError";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class DeleteAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}
    
    public async execute(accountNumber: number): Promise<void | Error> {
        const existingAccount = await this.accountRepository.getOneAccountByAccountNumber(accountNumber)
        
        if(existingAccount instanceof Error) {
            return existingAccount;
        }

        const account = await this.accountRepository.deleteAccount(accountNumber);

        if(account instanceof Error) {
            return account;
        }

    }
} 