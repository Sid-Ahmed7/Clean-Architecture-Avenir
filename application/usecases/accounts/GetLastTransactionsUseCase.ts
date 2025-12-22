import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";
import { TransactionEnrichmentService } from "../../ports/services/TransactionEnrichmentService";

export class GetLastTransactionsUseCase {
    public constructor(
        private readonly transactionRepository: TransactionRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly transactionEnrichmentService: TransactionEnrichmentService
    ) {}

    public async execute(userId: string, limit: number = 10): Promise<TransactionEntity[] | UserNotFoundError> {
        const accountsOrError = await this.accountRepository.getAccountsByUserId(userId);

        if (accountsOrError instanceof UserNotFoundError) {
            return accountsOrError;
        }

        const accountNumbers = accountsOrError.map((account) => account.accountNumber);
        const allTransactions = await this.transactionRepository.getTransactionsByAccountNumbers(accountNumbers);

        const sortedTransactions = allTransactions
            .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, limit);

        return await this.transactionEnrichmentService.enrichTransactionsWithUserNames(sortedTransactions);
    }
}
