import { SavingsAccountsEntity } from "../../../domain/entities/SavingsAccountEntity";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { CreateSavingsAccount } from "../../requests/CreateSavingsAccount";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";

export class CreateSavingsAccountUseCase {
    constructor(
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface
    ) {}

    public async execute(dto: CreateSavingsAccount): Promise<SavingsAccountsEntity | InvalidAccountError | Error> {
        const savingsAccount = SavingsAccountsEntity.from(
            dto.accountNumber,
            dto.productId,
            dto.userId,
            dto.interestRate,
            dto.maxDepositAmount,
            0,
            true, 
            undefined, 
            dto.maturity
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
