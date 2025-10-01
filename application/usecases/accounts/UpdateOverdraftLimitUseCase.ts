import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class UpdateOverdraftLimitUseCase {

    public constructor(private accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number, limit: number) {

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        account.updateOverdraftLimit(limit);

        const updateOverdraftLimit = await this.accountRepository.updateOneAccount(account);
        return updateOverdraftLimit;
    }

    
}