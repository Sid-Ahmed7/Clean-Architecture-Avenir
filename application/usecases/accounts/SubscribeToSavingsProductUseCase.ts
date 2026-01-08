import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { SavingsProductRepositoryInterface } from "../../ports/repositories/SavingsProductRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { IbanGeneratorService } from "../../ports/services/IbanGeneratorService";
import { SubscribeToSavingsProduct } from "../../requests/SubscribeToSavingsProduct";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";

export class SubscribeToSavingsProductUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly savingsProductRepository: SavingsProductRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly ibanGenerator: IbanGeneratorService
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

        console.log(' [SubscribeToSavingsProductUseCase] Generated savings account number:', savingsAccountNumber);

        // Generate proper IBAN
        const iban = await this.ibanGenerator.generateIban(savingsAccountNumber);
        if (iban instanceof Error) {
            console.log(' [SubscribeToSavingsProductUseCase] Error generating IBAN:', iban.message);
            return iban;
        }
        console.log(' [SubscribeToSavingsProductUseCase] Generated IBAN:', iban);

        // Create base account entry in accounts table first
        const baseAccount = AccountEntity.from(
            savingsAccountNumber,
            iban,
            dto.userId,
            AccountTypeEnum.SAVINGS,
            "EUR",
            AccountStatusEnum.ACTIVE,
            true,
            0, // Initial balance
            new Date(),
            3000, // withdrawal_limit
            3000, // transfer_limit
            1000, // overdraft_limit
            `Savings Account - ${product.name}`,
            0, // total_transfered
            new Date(), // last_transfer_reset_date
            mainAccount.accountNumber // parent_account_id - link to main account
        );

        if (baseAccount instanceof Error) {
            console.log(' [SubscribeToSavingsProductUseCase] Error creating base account entity:', baseAccount.message);
            return baseAccount;
        }

        console.log(' [SubscribeToSavingsProductUseCase] Creating base account in accounts table...');
        const createdBaseAccount = await this.accountRepository.createOneAccount(baseAccount);
        if (createdBaseAccount instanceof Error) {
            console.log(' [SubscribeToSavingsProductUseCase] Error creating base account:', createdBaseAccount.message);
            return createdBaseAccount;
        }
        console.log(' [SubscribeToSavingsProductUseCase] Base account created successfully');

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
        
        if (result instanceof Error) {
            return result;
        }
        
        // TODO: If initialDeposit is provided, transfer money from main account to savings
        
        return result;
    }
}
