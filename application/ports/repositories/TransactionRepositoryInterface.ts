import { TransactionEntity } from "../../../domain/entities/TransactionEntity";

export interface TransactionRepositoryInterface {
    save(transaction: TransactionEntity): Promise<void>;
    getTransactionsByAccountNumbers(accountNumbers: number[]): Promise<Array<TransactionEntity>>;
    getLastTransactions(accountNumbers: number[], limit: number): Promise<Array<TransactionEntity>>;
}

