import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class UpdateAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(account: AccountEntity): Promise<AccountEntity | Error> {

        const existingAccount = await this.accountRepository.getOneAccountByAccountNumber(account.accountNumber)
        
        if(existingAccount instanceof Error) {
            return existingAccount;
        }

        const updateAccount = await this.accountRepository.updateOneAccount(account);
        
        if(updateAccount instanceof Error) {
            return updateAccount;
        }

        return updateAccount;    
    }
    
}