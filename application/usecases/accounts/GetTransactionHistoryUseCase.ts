import { TransactionRepositoryInterface } from "../../ports/repositories/TransactionRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";
import { TransactionEnrichmentService } from "../../ports/services/TransactionEnrichmentService";

export class GetTransactionHistoryUseCase {
    public constructor(
        private readonly transactionRepository: TransactionRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly transactionEnrichmentService: TransactionEnrichmentService
    ) {}

    public async execute(userId: string): Promise<TransactionEntity[] | UserNotFoundError> {
        const accountsOrError = await this.accountRepository.getAccountsByUserId(userId);

        if (accountsOrError instanceof UserNotFoundError) {
            return accountsOrError;
        }

        const accountNumbers = accountsOrError.map((account) => account.accountNumber);
        const transactions = await this.transactionRepository.getTransactionsByAccountNumbers(accountNumbers);

        return await this.transactionEnrichmentService.enrichTransactionsWithUserNames(transactions);
    }
}

