import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";

export class GetSavingsAccountUseCase {
    constructor(
        private savingsAccountRepository: SavingsAccountRepositoryInterface
    ) {}

    public async execute(accountNumber: number): Promise<SavingsAccountsEntity | AccountNotFoundError> {
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(accountNumber);
        return savingsAccount;
    }
}
