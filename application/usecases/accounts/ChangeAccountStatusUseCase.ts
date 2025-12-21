import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { AccountAlreadyExistsError } from "../../errors/AccountAlreadyExistsError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { AllowedAccountStatusService } from "../../ports/services/AllowedAccountStatusService";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class ChangeAccountStatusUseCase {

    public constructor ( private readonly accountRepository: AccountRepositoryInterface, private readonly allowedStatusCheck: AllowedAccountStatusService){}
    
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
        
        const updatedAccount = await this.accountRepository.updateOneAccount(account);
        
        if(updatedAccount instanceof Error){
            return updatedAccount;
        }

        return updatedAccount;
    }
}