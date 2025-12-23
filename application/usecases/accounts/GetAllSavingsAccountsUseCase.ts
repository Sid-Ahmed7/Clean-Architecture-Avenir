import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";

export class GetAllSavingsAccountsUseCase {
    public constructor(private readonly savingsAccountRepository: SavingsAccountRepositoryInterface) {}

    public async execute(): Promise<Array<SavingsAccountsEntity>> {
        return await this.savingsAccountRepository.getAllSavingsAccounts();
    }
}
