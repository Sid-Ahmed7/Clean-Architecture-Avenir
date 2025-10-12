import { Accounts } from "../../../domain/interfaces/Accounts";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class GetAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number) : Promise<Accounts | Error>{

        const mainAccount = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if (mainAccount instanceof Error) {
            return mainAccount;
        }
        const subAccounts = await this.accountRepository.getSubAccountByParentAccountId(accountNumber);

        return {mainAccount, subAccounts};
    }
}