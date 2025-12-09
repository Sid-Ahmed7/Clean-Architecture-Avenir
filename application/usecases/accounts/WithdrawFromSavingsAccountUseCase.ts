import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";

export interface WithdrawFromSavingsAccountDTO {
    userId: string;
    savingsAccountNumber: number;
    amount: number;
}

export class WithdrawFromSavingsAccountUseCase {
    constructor(
        private savingsAccountRepository: SavingsAccountRepositoryInterface,
        private accountRepository: AccountRepositoryInterface,
        private transactionRepository: TransactionRepositoryInterface
    ) {}

    public async execute(dto: WithdrawFromSavingsAccountDTO): Promise<SavingsAccountsEntity | Error> {
        // 1. Get savings account
        const savingsAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(dto.savingsAccountNumber);
        if (savingsAccount instanceof Error) {
            return savingsAccount;
        }

        // 2. Verify ownership
        if (savingsAccount.userId !== dto.userId) {
            return new Error("You do not own this savings account");
        }

        // 3. Verify account is active
        if (!savingsAccount.isActive) {
            return new Error("This savings account is not active");
        }

        // 4. Calculate pending interest before balance change
        const daysSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const pendingInterest = (savingsAccount.balance * savingsAccount.interestRate * daysSinceLastUpdate) / (365 * 100);

        // 5. Check sufficient funds (interest not included in available balance)
        if (savingsAccount.balance < dto.amount) {
            return new Error(`Insufficient funds. Available: ${savingsAccount.balance}€`);
        }

        // 6. Get user's main account
        const userAccounts = await this.accountRepository.getAccountsByUserId(dto.userId);
        if (userAccounts instanceof Error) {
            return userAccounts;
        }

        const mainAccount = userAccounts[0];
        if (!mainAccount) {
            return new Error("No main account found");
        }

        // 7. Update savings account balance
        const newBalance = savingsAccount.balance - dto.amount;
        const updatedSavingsAccount = SavingsAccountsEntity.from(
            savingsAccount.accountNumber,
            savingsAccount.productId,
            savingsAccount.userId,
            savingsAccount.interestRate,
            savingsAccount.maxDepositAmount,
            savingsAccount.totalInterestEarned + pendingInterest,
            savingsAccount.isActive,
            newBalance,
            new Date(), // Update lastBalanceUpdate
            savingsAccount.lastInterestApplied,
            savingsAccount.maturity
        );

        if (updatedSavingsAccount instanceof Error) {
            return updatedSavingsAccount;
        }

        // 8. Credit main account
        mainAccount.currentBalance += dto.amount;
        const mainAccountUpdate = await this.accountRepository.updateOneAccount(mainAccount);
        if (mainAccountUpdate instanceof Error) {
            return mainAccountUpdate;
        }

        // 9. Save updated savings account
        const result = await this.savingsAccountRepository.updateSavingsAccount(updatedSavingsAccount);
        if (result instanceof Error) {
            // Rollback main account
            mainAccount.currentBalance -= dto.amount;
            await this.accountRepository.updateOneAccount(mainAccount);
            return result;
        }

        // TODO: Create transaction records

        return result;
    }
}
