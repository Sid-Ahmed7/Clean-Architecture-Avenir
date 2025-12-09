import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { CreateSavingsAccountDTO } from "./dto/CreateSavingsAccountDTO";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";

export class CreateSavingsAccountUseCase {
    constructor(
        private savingsAccountRepository: SavingsAccountRepositoryInterface
    ) {}

    public async execute(dto: CreateSavingsAccountDTO): Promise<SavingsAccountsEntity | InvalidAccountError | Error> {
        // Create the savings account entity
        const savingsAccount = SavingsAccountsEntity.from(
            dto.accountNumber,
            dto.productId,
            dto.userId,
            dto.interestRate,
            dto.maxDepositAmount,
            0, // totalInterestEarned starts at 0
            true, // isActive by default
            undefined, // lastInterestApplied
            dto.maturity
        );

        if (savingsAccount instanceof Error) {
            return savingsAccount;
        }

        // Save to repository
        const result = await this.savingsAccountRepository.createSavingsAccount(savingsAccount);
        
        return result;
    }
}
