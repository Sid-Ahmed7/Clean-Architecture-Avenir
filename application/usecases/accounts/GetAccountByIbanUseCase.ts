import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class GetAccountByIbanUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(iban: string) : Promise<AccountEntity | Error>{

        const account = await this.accountRepository.getOneAccountByIban(iban);

        if (account instanceof Error) {
            return account;
        }

        return account;
    }
}