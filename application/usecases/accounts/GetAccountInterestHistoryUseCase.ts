import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InterestSummary } from "../../responses/InterestSummary";

export class GetAccountInterestHistoryUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(accountNumber: number): Promise<InterestSummary | AccountNotFoundError | Error> {
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(accountNumber);
        
        if (savingsAccount instanceof AccountNotFoundError) {
            return savingsAccount;
        }

        // Get the corresponding account entity to access balance
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);
        
        if (account instanceof AccountNotFoundError) {
            return account;
        }

        // Calculate per SECOND with 1,000,000x multiplier!
        const secondsSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / 1000
        );
        const pendingInterest = (savingsAccount.balance * savingsAccount.interestRate * 1000000 * secondsSinceLastUpdate) / (31536000 * 100);

        // Calculate projected annual interest
        const projectedAnnualInterest = savingsAccount.getProjectedAnnualInterest(account.currentBalance);

        return {
            accountNumber: savingsAccount.accountNumber,
            currentBalance: account.currentBalance,
            interestRate: savingsAccount.interestRate,
            maxDepositAmount: savingsAccount.maxDepositAmount,
            totalInterestEarned: savingsAccount.totalInterestEarned,
            pendingInterest: Math.round(pendingInterest * 100) / 100,
            ...(savingsAccount.lastInterestApplied && { lastInterestApplied: savingsAccount.lastInterestApplied }),
            projectedAnnualInterest,
            isActive: savingsAccount.isActive
        };
    }
}
