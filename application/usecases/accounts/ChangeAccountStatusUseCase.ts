import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class ChangeAccountStatusUseCase {

    public constructor ( private accountRepository: AccountRepositoryInterface){}
    
    public async execute(accountNumber: number, status: AccountStatusEnum) {
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);
        
        if(account instanceof Error) {
            return account;
        }

        account.changeAccountStatus(status);

        return this.accountRepository.updateOneAccount(account);
    }
}