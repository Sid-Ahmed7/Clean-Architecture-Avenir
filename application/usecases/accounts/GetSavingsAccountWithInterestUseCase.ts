import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { SavingsAccountWithInterest } from "../../requests/SavingsAccountWithInterest";

export class GetSavingsAccountWithInterestUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface
    ) {}

    public async execute(dto: SavingsAccountWithInterest): Promise<SavingsAccountsEntity | Error> {
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(dto.accountNumber);
        if (savingsAccount instanceof Error) {
            return savingsAccount;
        }

        // Verify ownership if userId provided
        if (dto.userId && savingsAccount.userId !== dto.userId) {
            return new Error("You do not own this savings account");
        }

        // Calculate pending interest since last update
        const daysSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / (1000 * 60 * 60 * 24)
        );
        //Calculate per minute instead of per day
        const minutesSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / (1000 * 60)
        );
        const pendingInterest = (savingsAccount.balance * savingsAccount.interestRate * minutesSinceLastUpdate) / (525600 * 100);

        // Return account with updated interest 
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
