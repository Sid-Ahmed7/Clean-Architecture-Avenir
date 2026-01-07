import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { CreateSavingsAccount } from "../../requests/CreateSavingsAccount";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";

export class CreateSavingsAccountUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(dto: CreateSavingsAccount): Promise<SavingsAccountsEntity | InvalidAccountError | Error> {
        console.log('🔍 [CreateSavingsAccountUseCase] Starting execution with dto:', {
            accountNumber: dto.accountNumber,
            productId: dto.productId,
            userId: dto.userId,
            interestRate: dto.interestRate,
            maxDepositAmount: dto.maxDepositAmount,
            maturity: dto.maturity
        });

        // Verify that the account exists in the accounts table
        console.log('🔍 [CreateSavingsAccountUseCase] Checking if account exists:', dto.accountNumber);
        const existingAccount = await this.accountRepository.getOneAccountByAccountNumber(dto.accountNumber);
        
        if (existingAccount instanceof AccountNotFoundError) {
            console.log('❌ [CreateSavingsAccountUseCase] Account not found:', dto.accountNumber);
            return new InvalidAccountError(
                `Le compte avec le numéro ${dto.accountNumber} n'existe pas. ` +
                `Veuillez d'abord créer un compte principal avant de créer un compte d'épargne.`
            );
        }

        console.log('✅ [CreateSavingsAccountUseCase] Account found:', {
            accountNumber: existingAccount.accountNumber,
            iban: existingAccount.iban,
            userId: existingAccount.userId,
            accountType: existingAccount.accountType
        });

        // Create the savings account linked to the existing account
        console.log('🔍 [CreateSavingsAccountUseCase] Creating savings account entity...');
        const savingsAccount = SavingsAccountsEntity.from(
            dto.accountNumber,
            dto.productId,
            dto.userId,
            dto.interestRate,
            dto.maxDepositAmount,
            0, // totalInterestEarned
            true, // isActive
            0, // balance
            new Date(), // lastBalanceUpdate
            undefined, // lastInterestApplied
            dto.maturity
        );

        if (savingsAccount instanceof Error) {
            console.log('❌ [CreateSavingsAccountUseCase] Error creating savings account entity:', savingsAccount.message);
            return savingsAccount;
        }

        console.log('✅ [CreateSavingsAccountUseCase] Savings account entity created, saving to database...');
        const result = await this.savingsAccountRepository.createSavingsAccount(savingsAccount);
        
        if (result instanceof Error) {
            console.log('❌ [CreateSavingsAccountUseCase] Error saving to database:', result.message);
            return result;
        }
        
        console.log('✅ [CreateSavingsAccountUseCase] Savings account created successfully!');
        return result;
    }
}
