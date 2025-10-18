import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";

export class GetTransactionHistoryUseCase {
    public constructor(
        private transactionRepository: TransactionRepositoryInterface,
        private accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(userId: string): Promise<TransactionEntity[] | UserNotFoundError> {
        const accountsOrError = await this.accountRepository.getAccountsByUserId(userId);

        if (accountsOrError instanceof UserNotFoundError) {
            return accountsOrError;
        }

        const accountNumbers = accountsOrError.map((account) => account.accountNumber);
        return this.transactionRepository.getTransactionsByAccountNumbers(accountNumbers);
    }
}

