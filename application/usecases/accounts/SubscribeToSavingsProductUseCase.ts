import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { SavingsProductRepositoryInterface } from "../../ports/repositories/SavingsProductRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { SubscribeToSavingsProduct } from "../../responses/SubscribeToSavingsProduct";

export class SubscribeToSavingsProductUseCase {
    constructor(
        private savingsAccountRepository: SavingsAccountRepositoryInterface,
        private savingsProductRepository: SavingsProductRepositoryInterface,
        private accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(dto: SubscribeToSavingsProduct): Promise<SavingsAccountsEntity | Error> {
        // Get the product
        const product = await this.savingsProductRepository.getProductById(dto.productId);
        if (product instanceof Error) {
            return product;
        }

        if (!product.isActive) {
            return new Error("This savings product is no longer available");
        }

        // Get user's main account to generate savings account number
        const userAccounts = await this.accountRepository.getAccountsByUserId(dto.userId);
        if (userAccounts instanceof Error) {
            return userAccounts;
        }
        
        if (!userAccounts || userAccounts.length === 0) {
            return new Error("User has no bank account");
        }

        // Generate savings account number (modify last 2 digits of main account)
        const mainAccount = userAccounts[0];
        if (!mainAccount) {
            return new Error("User has no bank account");
        }
        
        const mainAccountNumber = mainAccount.accountNumber;
        
        // Count existing savings accounts for this user to generate unique suffix
        const existingSavingsAccounts = await this.savingsAccountRepository.getSavingsAccountsByUserId(dto.userId);
        const savingsCount = Array.isArray(existingSavingsAccounts) ? existingSavingsAccounts.length : 0;
        
        // Generate savings account number by modifying last 2 digits
        // Example: 98159411125 -> 98159411101 (first savings), 98159411102 (second savings)
        const baseNumber = Math.floor(mainAccountNumber / 100); // Remove last 2 digits
        const suffix = (savingsCount + 1) % 100; // Suffix from 01 to 99
        const savingsAccountNumber = baseNumber * 100 + suffix;

        // Create savings account linked to product
        const savingsAccount = SavingsAccountsEntity.from(
            savingsAccountNumber,
            dto.productId,
            dto.userId,
            product.interestRate,
            product.maxDepositAmount,
            0, // totalInterestEarned
            true, // isActive
            0, // balance (starts at 0)
            new Date(), // lastBalanceUpdate
            undefined, // lastInterestApplied
            undefined // maturity
        );

        if (savingsAccount instanceof Error) {
            return savingsAccount;
        }

        // Save to repository
        const result = await this.savingsAccountRepository.createSavingsAccount(savingsAccount);
        
        // TODO: If initialDeposit is provided, transfer money from main account to savings
        
        return result;
    }
}
