import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class CustomAccountNameUseCase {
    public constructor(private readonly accountRepository: AccountRepositoryInterface){}


    public async execute(accountNumber: number, newAccountName: string): Promise<AccountEntity | Error> {

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        account.updateCustomAccountName(newAccountName);

        const updatedAccountName = await this.accountRepository.updateOneAccount(account);
        
        if(updatedAccountName instanceof Error) {
            return updatedAccountName;
        }

        return updatedAccountName;
    }
}