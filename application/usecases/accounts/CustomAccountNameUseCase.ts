import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class CustomAccountNameUseCase {
    public constructor(private accountRepository: AccountRepositoryInterface){}


    public async execute(accountNumber: number, newAccountName: string): Promise<AccountEntity | Error> {

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        account.updateCustomAccountName(newAccountName);

        const updatedAccountName = await this.accountRepository.updateOneAccount(account);
        return updatedAccountName;
    }
}