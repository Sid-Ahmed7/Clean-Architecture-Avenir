import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { SavingsAccountWithInterest } from "../../responses/SavingsAccountWithInterest";

export class GetSavingsAccountWithInterestUseCase {
    constructor(
        private savingsAccountRepository: SavingsAccountRepositoryInterface
    ) {}

    public async execute(dto: SavingsAccountWithInterest): Promise<SavingsAccountsEntity | Error> {
        // 1. Get savings account
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(dto.accountNumber);
        if (savingsAccount instanceof Error) {
            return savingsAccount;
        }

        // 2. Verify ownership if userId provided
        if (dto.userId && savingsAccount.userId !== dto.userId) {
            return new Error("You do not own this savings account");
        }

        // 3. Calculate pending interest since last update
        const daysSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const pendingInterest = (savingsAccount.balance * savingsAccount.interestRate * daysSinceLastUpdate) / (365 * 100);

        // 4. Return account with updated interest (not saved to DB, just calculated for display)
        const accountWithInterest = SavingsAccountsEntity.from(
            savingsAccount.accountNumber,
            savingsAccount.productId,
            savingsAccount.userId,
            savingsAccount.interestRate,
            savingsAccount.maxDepositAmount,
            savingsAccount.totalInterestEarned + pendingInterest,
            savingsAccount.isActive,
            savingsAccount.balance,
            savingsAccount.lastBalanceUpdate,
            savingsAccount.lastInterestApplied,
            savingsAccount.maturity
        );

        return accountWithInterest instanceof Error ? accountWithInterest : accountWithInterest;
    }
}
