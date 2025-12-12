import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { SavingsProductRepositoryInterface } from "../../ports/repositories/SavingsProductRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { DepositToSavingsAccount } from "../../responses/DepositToSavingsAccount";

export class DepositToSavingsAccountUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly savingsProductRepository: SavingsProductRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly transactionRepository: TransactionRepositoryInterface
    ) {}

    public async execute(dto: DepositToSavingsAccount): Promise<SavingsAccountsEntity | Error> {
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

        // 4. Get product to check limits
        const product = await this.savingsProductRepository.getProductById(savingsAccount.productId);
        if (product instanceof Error) {
            return product;
        }

        // 5. Check minimum deposit amount
        if (product.minDepositAmount && dto.amount < product.minDepositAmount) {
            return new Error(`Minimum deposit amount is ${product.minDepositAmount}€`);
        }

        // 6. Check maximum deposit amount (total balance after deposit)
        const newBalance = savingsAccount.balance + dto.amount;
        if (product.maxDepositAmount && newBalance > product.maxDepositAmount) {
            return new Error(`Maximum balance limit is ${product.maxDepositAmount}€. Current balance: ${savingsAccount.balance}€`);
        }

        // 7. Get user's main account
        const userAccounts = await this.accountRepository.getAccountsByUserId(dto.userId);
        if (userAccounts instanceof Error) {
            return userAccounts;
        }

        const mainAccount = userAccounts[0];
        if (!mainAccount) {
            return new Error("No main account found");
        }

        // 8. Check main account has sufficient funds
        if (mainAccount.currentBalance < dto.amount) {
            return new Error(`Insufficient funds. Available: ${mainAccount.currentBalance}€`);
        }

        // 9. Calculate pending interest before balance change
        const daysSinceLastUpdate = Math.floor(
            (new Date().getTime() - savingsAccount.lastBalanceUpdate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const pendingInterest = (savingsAccount.balance * savingsAccount.interestRate * daysSinceLastUpdate) / (365 * 100);

        // 10. Update savings account balance
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

        // 11. Debit main account
        mainAccount.currentBalance -= dto.amount;
        const mainAccountUpdate = await this.accountRepository.updateOneAccount(mainAccount);
        if (mainAccountUpdate instanceof Error) {
            return mainAccountUpdate;
        }

        // 12. Save updated savings account
        const result = await this.savingsAccountRepository.updateSavingsAccount(updatedSavingsAccount);
        if (result instanceof Error) {
            // Rollback main account
            mainAccount.currentBalance += dto.amount;
            await this.accountRepository.updateOneAccount(mainAccount);
            return result;
        }

        // TODO: Create transaction records

        return result;
    }
}
