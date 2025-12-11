import { PositionAlreadyExistsError } from "../../../application/errors/PositionAlreadyExistsError";
import { PositionNotFoundError } from "../../../application/errors/PositionNotFoundError";
import { TransactionNotFoundError } from "../../../application/errors/TransactionNotFoundError";
import { StockHoldingRepositoryInterface } from "../../../application/ports/repositories/stocks/StockHoldingRepositoryInterface";
import { StockTransactionRepositoryInterface } from "../../../application/ports/repositories/stocks/StockTransactionRepositoryInterface";
import { StockHoldingEntity } from "../../../domain/entities/StockHoldingEntity";
import { StockTransactionEntity } from "../../../domain/entities/StockTransactionEntity";

export class InMemoryStockTransactionRepository implements StockTransactionRepositoryInterface {

    private transactions: Array<StockTransactionEntity>;

    public constructor() {
        this.transactions = [];
    }


    public async findTransactionById(id: string): Promise<StockTransactionEntity | TransactionNotFoundError> {
        const transaction = this.transactions.find(t => t.id === id);

        if(!transaction) {
            return new TransactionNotFoundError(`Transaction with ${id} not found`)
        }

        return transaction;
    }

    public async findTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>> {
        return this.transactions.filter(t => t.buyerUserId === userId || t.sellerUserId === userId);
    }

    public async findTransactionsBySymbol(symbol: string): Promise<Array<StockTransactionEntity>> {
        return this.transactions.filter(t => t.stockSymbol === symbol);
    }

    public async findBuyTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>> {
        return this.transactions.filter(t => t.buyerUserId === userId);
    }

    public async findSellTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>> {
        return this.transactions.filter(t => t.sellerUserId === userId);
    }

    public async findTransactionsByBuyOrderId(buyOrderId: string): Promise<Array<StockTransactionEntity>> {
        return this.transactions.filter(t => t.buyOrderId === buyOrderId);
    }

    public async findTransactionsBySellOrderId(sellOrderId: string): Promise<Array<StockTransactionEntity>> {
        return this.transactions.filter(t => t.sellOrderId === sellOrderId);
    }

    public async getAllTransactions(): Promise<Array<StockTransactionEntity>> {
    return [...this.transactions];

    }

    public async findRecentTransactions(minutes: number): Promise<Array<StockTransactionEntity>> {
        const limit = Date.now() - minutes * 60 * 1000;

        return this.transactions.filter(tx => tx.executedAt.getTime() >= limit);
    }

    public async findTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Array<StockTransactionEntity>> {
        return this.transactions.filter(tx => tx.executedAt >= startDate && tx.executedAt <= endDate); 
    }

    public async createTransaction(transaction: StockTransactionEntity): Promise<StockTransactionEntity> {
        this.transactions.push(transaction);
        return transaction;
    }
}