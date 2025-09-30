import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class ToggleAccountActiveUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number, isActive: boolean): Promise<AccountEntity | Error> {

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if(account instanceof Error) {
            return account;
        }

        account.updateIsActive(isActive);

        const updatedAccount = await this.accountRepository.updateOneAccount(account);
        
        if(updatedAccount instanceof Error){
            return updatedAccount;
        }

        return updatedAccount;
    }


}