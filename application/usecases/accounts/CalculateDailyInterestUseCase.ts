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

    public async execute(): Promise<Array<InterestCalculationResult> |Error> {
        const results: Array<InterestCalculationResult> = [];

        const savingsAccounts = await this.savingsAccountRepository.getSavingsAccountsWithActiveInterest();

        for (const savingsAccount of savingsAccounts) {
            const account = await this.accountRepository.getOneAccountByAccountNumber(savingsAccount.accountNumber);

            if (account instanceof Error) {
                return new AccountNotFoundError("Account not found");
            }

            const dailyInterest = savingsAccount.calculateDailyInterest(account.currentBalance);

            if (dailyInterest > 0) {
                account.updateBalance(account.currentBalance + dailyInterest);

                savingsAccount.creditInterest(dailyInterest);

                await this.accountRepository.updateOneAccount(account);
                await this.savingsAccountRepository.updateSavingsAccount(savingsAccount);

                results.push({
                    accountNumber: savingsAccount.accountNumber,
                    interestCredited: dailyInterest,
                    newBalance: account.currentBalance,
                    totalInterestEarned: savingsAccount.totalInterestEarned
                });
            }
        }

        return results;
    }
}
