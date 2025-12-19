import { TransactionRepositoryInterface } from "../../../application/ports/repositories/TransactionRepositoryInterface";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";

export class InMemoryTransactionRepository implements TransactionRepositoryInterface {
    private transactions: TransactionEntity[];

    public constructor() {
        this.transactions = [];
    }

    public async save(transaction: TransactionEntity): Promise<void> {
        this.transactions.push(transaction);
    }

    public async getTransactionsByAccountNumbers(accountNumbers: number[]): Promise<TransactionEntity[]> {
        return this.transactions.filter((transaction) =>
            accountNumbers.includes(transaction.debitAccount) ||
            accountNumbers.includes(transaction.creditAccount)
        );
    }

    public async getLastTransactions(accountNumbers: number[], limit: number): Promise<TransactionEntity[]> {
        const filtered = this.transactions.filter((transaction) =>
            accountNumbers.includes(transaction.debitAccount) ||
            accountNumbers.includes(transaction.creditAccount)
        );

        return filtered
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);
    }
}

