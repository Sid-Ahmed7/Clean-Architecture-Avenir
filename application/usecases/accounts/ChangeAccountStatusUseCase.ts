import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { AccountAlreadyExistsError } from "../../../domain/errors/AccountAlreadyExistsError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class ChangeAccountStatusUseCase {

    public constructor ( private accountRepository: AccountRepositoryInterface){}
    
    public async execute(accountNumber: number, status: AccountStatusEnum) {
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);
        
        if(account instanceof Error) {
            return account;
        }
        

        account.changeAccountStatus(status);
        
        const updateAccount = this.accountRepository.updateOneAccount(account);
        
        if(updateAccount instanceof Error){
            return updateAccount;
        }

        return updateAccount;
    }
}