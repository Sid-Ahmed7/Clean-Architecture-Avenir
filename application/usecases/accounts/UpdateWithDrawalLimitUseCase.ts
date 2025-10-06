import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class UpdateWithDrawalLimitUseCase {

    public constructor(private accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number, limit: number) {

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        account.updateWithDrawalLimit(limit);

        const updatedWithDrawalLimit = await this.accountRepository.updateOneAccount(account);
        return updatedWithDrawalLimit;
    }

    
}