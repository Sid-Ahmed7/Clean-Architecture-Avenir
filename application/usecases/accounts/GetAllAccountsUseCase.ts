import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class GetAllAccountsUseCase {
    public constructor(private readonly accountRepository: AccountRepositoryInterface) {}

    public async execute(): Promise<Array<AccountEntity>> {
        return await this.accountRepository.getAllAccounts();
    }
}
