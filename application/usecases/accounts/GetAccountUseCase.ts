import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class GetAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number){

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if (account instanceof Error) {
            return account;
        }

        return account;
    }
}