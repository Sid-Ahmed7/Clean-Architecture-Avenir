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
  
        const existingAccount = await this.accountRepository.getOneAccountByAccountNumber(dto.accountNumber);
        
        if (existingAccount instanceof AccountNotFoundError) {
            return new InvalidAccountError(
                `Le compte avec le numéro ${dto.accountNumber} n'existe pas. ` +
                `Veuillez d'abord créer un compte principal avant de créer un compte d'épargne.`
            );
        }

        const savingsAccount = SavingsAccountsEntity.from(
            dto.accountNumber,
            dto.productId,
            dto.userId,
            dto.interestRate,
            dto.maxDepositAmount,
            0, 
            true, 
            0, 
            new Date(), 
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
