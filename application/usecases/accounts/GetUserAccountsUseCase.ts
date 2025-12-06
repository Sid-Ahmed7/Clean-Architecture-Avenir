import {AccountRepositoryInterface} from "../../ports/repositories/AccountRepositoryInterface";
import { AccountEntity } from "../../../domain/entities/AccountEntity";


export class GetUserAccountsUseCase {
    public constructor(private readonly accountRepository: AccountRepositoryInterface){}

    public async execute(userId: string): Promise<Array<AccountEntity> | Error> {
        const accounts = await this.accountRepository.getAccountsByUserId(userId);

        if(accounts instanceof Error) {
            return accounts;
        }

        return accounts;
    }
}