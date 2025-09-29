import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { AccountAlreadyExistsError } from "../../../domain/errors/AccountAlreadyExistsError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { AllowedAccountStatus } from "../../../domain/services/AllowedAccountStatus";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class ChangeAccountStatusUseCase {

    public constructor ( private accountRepository: AccountRepositoryInterface, private allowedStatusCheck: AllowedAccountStatus){}
    
    public async execute(accountNumber: number, status: AccountStatusEnum) {
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);
        
        if(account instanceof Error) {
            return account;
        }

        const isAllowed = this.allowedStatusCheck.checkIfAccountStatusIsValid(account.accountStatus, status);

        if(!isAllowed) {
            return new InvalidAccountError("Not allowed to change status");
        }
        

        account.changeAccountStatus(status);
        
        const updateAccount = this.accountRepository.updateOneAccount(account);
        
        if(updateAccount instanceof Error){
            return updateAccount;
        }

        return updateAccount;
    }
}