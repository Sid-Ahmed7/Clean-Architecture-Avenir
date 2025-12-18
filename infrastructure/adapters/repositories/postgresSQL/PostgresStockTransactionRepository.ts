import { StockTransactionRepositoryInterface } from "../../../../application/ports/repositories/stocks/StockTransactionRepositoryInterface";
import { StockTransactionEntity } from "../../../../domain/entities/StockTransactionEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresStockTransactionRow } from "./types/PostgresStockTransactionRow";
import { TransactionNotFoundError } from "../../../../application/errors/TransactionNotFoundError";


export class PostgresStockTransactionRepository implements StockTransactionRepositoryInterface {

    public async createTransaction(transaction: StockTransactionEntity): Promise<StockTransactionEntity | Error> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            `INSERT INTO stock_transactions (
                id, buy_order_id, sell_order_id, stock_symbol, quantity,
                execution_price, buyer_user_id, seller_user_id, buyer_fee,
                seller_fee, executed_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [
                transaction.id,
                transaction.buyOrderId,
                transaction.sellOrderId,
                transaction.stockSymbol,
                transaction.quantity,
                transaction.executionPrice,
                transaction.buyerUserId,
                transaction.sellerUserId,
                transaction.buyerFee,
                transaction.sellerFee,
                transaction.executedAt
            ]
        );

        const row = result.rows[0];
        if(!row) {
            return new Error("Error creation transaction")
        }
        const created = this.mapRowToEntity(row);
        if (created instanceof Error) {
            return created;
        }

        return created;
    }

    public async findTransactionById(id: string): Promise<StockTransactionEntity | TransactionNotFoundError | Error> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            'SELECT * FROM stock_transactions WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return new TransactionNotFoundError(`Transaction ${id} not found`);
        }
        const row = result.rows[0];
        if(!row) {
            return new TransactionNotFoundError(`Transaction ${id} not found`);

        }

        const transaction = this.mapRowToEntity(row);
        if (transaction instanceof Error) {
            return transaction;
        }

        return transaction;
    }

    public async findTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            `SELECT * FROM stock_transactions
             WHERE buyer_user_id = $1 OR seller_user_id = $1
             ORDER BY executed_at DESC`,
            [userId]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is StockTransactionEntity => !(transaction instanceof Error));
    }

    public async findTransactionsBySymbol(symbol: string): Promise<Array<StockTransactionEntity>> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            'SELECT * FROM stock_transactions WHERE stock_symbol = $1 ORDER BY executed_at DESC',
            [symbol]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is StockTransactionEntity => !(transaction instanceof Error));
    }

    public async findBuyTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            'SELECT * FROM stock_transactions WHERE buyer_user_id = $1 ORDER BY executed_at DESC',
            [userId]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is StockTransactionEntity => !(transaction instanceof Error));
    }

    public async findSellTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            'SELECT * FROM stock_transactions WHERE seller_user_id = $1 ORDER BY executed_at DESC',
            [userId]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is StockTransactionEntity => !(transaction instanceof Error));
    }

    public async findTransactionsByBuyOrderId(buyOrderId: string): Promise<Array<StockTransactionEntity>> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            'SELECT * FROM stock_transactions WHERE buy_order_id = $1 ORDER BY executed_at DESC',
            [buyOrderId]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is StockTransactionEntity => !(transaction instanceof Error));
    }

    public async findTransactionsBySellOrderId(sellOrderId: string): Promise<Array<StockTransactionEntity>> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            'SELECT * FROM stock_transactions WHERE sell_order_id = $1 ORDER BY executed_at DESC',
            [sellOrderId]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is StockTransactionEntity => !(transaction instanceof Error));
    }

    public async getAllTransactions(): Promise<Array<StockTransactionEntity>> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            'SELECT * FROM stock_transactions ORDER BY executed_at DESC'
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is StockTransactionEntity => !(transaction instanceof Error));
    }

    public async findRecentTransactions(minutes: number): Promise<Array<StockTransactionEntity>> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            `SELECT * FROM stock_transactions
             WHERE executed_at >= NOW() - INTERVAL '${minutes} minutes'
             ORDER BY executed_at DESC`
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is StockTransactionEntity => !(transaction instanceof Error));
    }

    public async findTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Array<StockTransactionEntity>> {
        const result = await pgPool.query<PostgresStockTransactionRow>(
            'SELECT * FROM stock_transactions WHERE executed_at BETWEEN $1 AND $2 ORDER BY executed_at DESC',
            [startDate, endDate]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((transaction): transaction is StockTransactionEntity => !(transaction instanceof Error));
    }

    private mapRowToEntity(row: PostgresStockTransactionRow): StockTransactionEntity | Error {
        const transaction = StockTransactionEntity.from(
            row.id,
            row.buy_order_id,
            row.sell_order_id,
            row.stock_symbol,
            row.quantity,
            row.execution_price,
            row.buyer_user_id,
            row.seller_user_id,
            row.buyer_fee,
            row.seller_fee,
            row.executed_at
        );

        if (transaction instanceof Error) {
            return transaction;
        }

        return transaction;
    }
}