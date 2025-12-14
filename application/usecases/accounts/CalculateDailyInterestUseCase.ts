import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { InterestCalculationResult } from "../../responses/InterestCalculationResult";

export class CalculateDailyInterestUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(): Promise<Array<InterestCalculationResult> | Error> {
        const results: Array<InterestCalculationResult> = [];

        // Get all savings accounts with active interest
        const savingsAccounts = await this.savingsAccountRepository.getSavingsAccountsWithActiveInterest();

        for (const savingsAccount of savingsAccounts) {
            try {
                // Get the corresponding account entity to access balance
                const account = await this.accountRepository.getOneAccountByAccountNumber(savingsAccount.accountNumber);
                
                if (account instanceof AccountNotFoundError) {
                    console.error(`Account ${savingsAccount.accountNumber} not found, skipping interest calculation`);
                    continue;
                }

                // Calculate daily interest
                const dailyInterest = savingsAccount.calculateDailyInterest(account.currentBalance);

                if (dailyInterest > 0) {
                    // Update account balance
                    account.updateBalance(account.currentBalance + dailyInterest);
                    
                    // Credit interest to savings account
                    savingsAccount.creditInterest(dailyInterest);

                    // Update both repositories
                    await this.accountRepository.updateOneAccount(account);
                    await this.savingsAccountRepository.updateSavingsAccount(savingsAccount);

                    results.push({
                        accountNumber: savingsAccount.accountNumber,
                        interestCredited: dailyInterest,
                        newBalance: account.currentBalance,
                        totalInterestEarned: savingsAccount.totalInterestEarned
                    });
                }
            } catch (error) {
                console.error(`Error calculating interest for account ${savingsAccount.accountNumber}:`, error);
                continue;
            }
        }

        return results;
    }
}
