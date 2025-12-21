import { TransactionRepositoryInterface } from "../../../application/ports/repositories/TransactionRepositoryInterface";
import { TransactionEntity } from "../../../domain/entities/TransactionEntity";

export class InMemoryTransactionRepository implements TransactionRepositoryInterface {
    private transactions: TransactionEntity[];

    public constructor() {
        this.transactions = [];
    }

    public async save(transaction: TransactionEntity): Promise<void> {
        const existingIndex = this.transactions.findIndex(
            (t) => t.transactionReference === transaction.transactionReference
        );

        if (existingIndex !== -1) {
            this.transactions[existingIndex] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    public async getTransactionsByAccountNumbers(accountNumbers: number[]): Promise<TransactionEntity[]> {
        const uniqueTransactions = new Map<string, TransactionEntity>();

        this.transactions.forEach((transaction) => {
            if (accountNumbers.includes(transaction.debitAccount) ||
                accountNumbers.includes(transaction.creditAccount)) {
                uniqueTransactions.set(transaction.transactionReference, transaction);
            }
        });

        return Array.from(uniqueTransactions.values());
    }


}

