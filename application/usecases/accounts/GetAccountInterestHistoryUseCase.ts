import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InterestSummary } from "../../responses/InterestSummary";

export class GetAccountInterestHistoryUseCase {
    constructor(
        private savingsAccountRepository: SavingsAccountRepositoryInterface,
        private accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(accountNumber: number): Promise<InterestSummary | AccountNotFoundError | Error> {
        // Get the savings account
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(accountNumber);
        
        if (savingsAccount instanceof AccountNotFoundError) {
            return savingsAccount;
        }

        // Get the corresponding account entity to access balance
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);
        
        if (account instanceof AccountNotFoundError) {
            return account;
        }

        // Calculate projected annual interest
        const projectedAnnualInterest = savingsAccount.getProjectedAnnualInterest(account.currentBalance);

        return {
            accountNumber: savingsAccount.accountNumber,
            currentBalance: account.currentBalance,
            interestRate: savingsAccount.interestRate,
            maxDepositAmount: savingsAccount.maxDepositAmount,
            totalInterestEarned: savingsAccount.totalInterestEarned,
            ...(savingsAccount.lastInterestApplied && { lastInterestApplied: savingsAccount.lastInterestApplied }),
            projectedAnnualInterest,
            isActive: savingsAccount.isActive
        };
    }
}
