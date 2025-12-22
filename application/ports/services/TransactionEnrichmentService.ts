import { TransactionEntity } from "../../../domain/entities/TransactionEntity";
import { UserRepositoryInterface } from "../repositories/auth/UserRepositoryInterface";

export interface TransactionEnrichmentService {
    enrichTransactionsWithUserNames(transactions: TransactionEntity[]): Promise<TransactionEntity[]>;
}
