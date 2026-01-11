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
        const suffix = (savingsCount + 1) % 100; 
        const savingsAccountNumber = baseNumber * 100 + suffix;


        const iban = await this.ibanGenerator.generateIban(savingsAccountNumber);
        if (iban instanceof Error) {
            return iban;
        }

        const baseAccount = AccountEntity.from(
            savingsAccountNumber,
            iban,
            dto.userId,
            AccountTypeEnum.SAVINGS,
            "EUR",
            AccountStatusEnum.ACTIVE,
            true,
            0, 
            new Date(),
            3000,
            3000, 
            1000, 
            `Savings Account - ${product.name}`,
            0, 
            new Date(),
            mainAccount.accountNumber 
        );

        if (baseAccount instanceof Error) {
            return baseAccount;
        }

        const createdBaseAccount = await this.accountRepository.createOneAccount(baseAccount);
        if (createdBaseAccount instanceof Error) {
            return createdBaseAccount;
        }

        const savingsAccount = SavingsAccountsEntity.from(
            savingsAccountNumber,
            dto.productId,
            dto.userId,
            product.interestRate,
            product.maxDepositAmount,
            0, 
            true,
            0, 
            new Date(), 
            undefined,
            undefined 
        );

        if (savingsAccount instanceof Error) {
            return savingsAccount;
        }

        const result = await this.savingsAccountRepository.createSavingsAccount(savingsAccount);
        
        if (result instanceof Error) {
            return result;
        }
                
        return result;
    }
}
