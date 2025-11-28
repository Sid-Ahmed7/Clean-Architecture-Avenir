import { StockTransactionEntity } from "../../../../domain/entities/StockTransactionEntity";
import { TransactionNotFoundError } from "../../../errors/TransactionNotFoundError";

export interface StockTransactionRepositoryInterface {

    createTransaction(transaction: StockTransactionEntity): Promise<StockTransactionEntity>;
    findTransactionById(id: number): Promise<StockTransactionEntity | TransactionNotFoundError>;
    findTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>>;
    findTransactionsBySymbol(symbol: string): Promise<Array<StockTransactionEntity>>;
    findBuyTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>>;
    findSellTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>>;
    findTransactionsByBuyOrderId(buyOrderId: number): Promise<Array<StockTransactionEntity>>;
    findTransactionsBySellOrderId(sellOrderId: number): Promise<Array<StockTransactionEntity>>;
    getAllTransactions(): Promise<Array<StockTransactionEntity>>;
    findRecentTransactions(minutes: number): Promise<Array<StockTransactionEntity>>;
    findTransactionsByDateRange(startDate: Date,endDate: Date): Promise<Array<StockTransactionEntity>>;

}