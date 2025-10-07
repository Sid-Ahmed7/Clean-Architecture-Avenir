import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class GetAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number) : Promise<AccountEntity | Error>{

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if (account instanceof Error) {
            return account;
        }

        return account;
    }
}