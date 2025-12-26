import { TransactionRepositoryInterface } from '../../../../application/ports/repositories/TransactionRepositoryInterface';
import { TransactionEntity } from '../../../../domain/entities/TransactionEntity';
import { pgPool } from '../../config/database/configPostgresSQL';
import { PostgresTransactionRow } from './types/PostgresTransactionRow';
export class PostgresTransactionRepository implements TransactionRepositoryInterface {

    public async save(transaction: TransactionEntity): Promise<void> {
    
        await pgPool.query<PostgresTransactionRow>(
            `INSERT INTO transactions (
                transaction_reference, debit_account, credit_account, amount,
                transaction_type, executed_by, status, description, category,
                created_at, debit_user_id, credit_user_id, debit_user_name, credit_user_name
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
                transaction.transactionReference,
                transaction.debitAccount,
                transaction.creditAccount,
                transaction.amount,
                transaction.transactionType,
                transaction.executedBy,
                transaction.status,
                transaction.description,
                transaction.category,
                transaction.createdAt,
                transaction.debitUserId,
                transaction.creditUserId,
                transaction.debitUserName,
                transaction.creditUserName
            ]
        );
    }

    public async getTransactionsByAccountNumbers(accountNumbers: number[]): Promise<Array<TransactionEntity>> {
        const result = await pgPool.query<PostgresTransactionRow>(
            `SELECT * FROM transactions
             WHERE debit_account = ANY($1) OR credit_account = ANY($1)
             ORDER BY created_at DESC`,
            [accountNumbers]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is TransactionEntity => !(transaction instanceof Error));
    }

    private mapRowToEntity(row: PostgresTransactionRow): TransactionEntity | Error {
        const transaction = TransactionEntity.from(
            row.transaction_reference,
            Number(row.debit_account),
            Number(row.credit_account),
            Number(row.amount),
            row.transaction_type,
            row.executed_by,
            row.status,
            row.created_at,
            row.description ?? undefined,
            row.category ?? undefined
        );

        if (transaction instanceof Error) {
            return transaction;
        }

        transaction.debitUserId = row.debit_user_id ?? undefined;
        transaction.creditUserId = row.credit_user_id ?? undefined;
        transaction.debitUserName = row.debit_user_name ?? undefined;
        transaction.creditUserName = row.credit_user_name ?? undefined;

        return transaction;
    }
}