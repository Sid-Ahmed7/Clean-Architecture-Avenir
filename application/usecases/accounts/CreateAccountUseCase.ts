import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountAlreadyExistsError } from "../../../domain/errors/AccountAlreadyExistsError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class CreateAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(account: AccountEntity): Promise<AccountEntity | Error>{

        const existingAccount = await this.accountRepository.getOneAccountByAccountNumber(account.accountNumber)
        
        if(existingAccount instanceof Error) {
            return existingAccount;
        }

        const createdAccount = await this.accountRepository.createOneAccount(account);
        
        if(createdAccount instanceof Error) {
            return createdAccount;
        }

        return createdAccount;
    }
    
}