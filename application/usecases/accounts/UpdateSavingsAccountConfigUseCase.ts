import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { UpdateSavingsAccountConfig } from "../../requests/UpdateSavingsAccountConfig";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";

export class UpdateSavingsAccountConfigUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface
    ) {}

    public async execute(dto: UpdateSavingsAccountConfig): Promise<SavingsAccountsEntity | AccountNotFoundError | InvalidAccountError | Error> {
        const existingAccount = await this.savingsAccountRepository.getSavingsAccountByNumber(dto.accountNumber);
        
        if (existingAccount instanceof AccountNotFoundError) {
            return existingAccount;
        }

        // Update interest rate if provided
        if (dto.interestRate !== undefined) {
            const updateResult = existingAccount.updateInterestRate(dto.interestRate);
            if (updateResult instanceof Error) {
                return updateResult;
            }
        }

        // Update max deposit if provided
        if (dto.maxDepositAmount !== undefined) {
            const updateResult = existingAccount.updateMaxDeposit(dto.maxDepositAmount);
            if (updateResult instanceof Error) {
                return updateResult;
            }
        }

        // Update active status if provided
        if (dto.isActive !== undefined) {
            if (dto.isActive) {
                existingAccount.activateInterest();
            } else {
                existingAccount.deactivateInterest();
            }
        }

        const result = await this.savingsAccountRepository.updateSavingsAccount(existingAccount);
        
        if (result instanceof Error) {
            return result;
        }
        
        return result;
    }
}
