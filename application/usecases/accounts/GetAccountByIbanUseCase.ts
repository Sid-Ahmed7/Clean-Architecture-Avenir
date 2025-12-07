import { Accounts } from "../../responses/Accounts";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class GetAccountByIbanUseCase {
    public constructor ( private readonly accountRepository: AccountRepositoryInterface){}

    public async execute(iban: string) : Promise<Accounts | Error>{

        const mainAccount = await this.accountRepository.getOneAccountByIban(iban);

        if (mainAccount instanceof Error) {
            return mainAccount;
        }
        const subAccounts = await this.accountRepository.getSubAccountByParentAccountId(mainAccount.accountNumber);

        return {mainAccount, subAccounts};
    }
}