import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class CreateAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(account: AccountEntity) {

        const existingAccount = await this.accountRepository.getOneAccountByAccountNumber(account.accountNumber)
        
        if(existingAccount instanceof Error) {
            return existingAccount;
        }

        return this.accountRepository.createOneAccount(account);
    
    }
    
}