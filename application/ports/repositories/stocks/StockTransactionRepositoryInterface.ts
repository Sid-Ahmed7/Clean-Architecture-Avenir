import { StockTransactionEntity } from "../../../../domain/entities/StockTransactionEntity";
import { TransactionNotFoundError } from "../../../errors/TransactionNotFoundError";

export interface StockTransactionRepositoryInterface {

    createTransaction(transaction: StockTransactionEntity): Promise<StockTransactionEntity | Error>;
    findTransactionById(id: string): Promise<StockTransactionEntity | TransactionNotFoundError | Error>;
    findTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>>;
    findTransactionsBySymbol(symbol: string): Promise<Array<StockTransactionEntity>>;
    findBuyTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>>;
    findSellTransactionsByUserId(userId: string): Promise<Array<StockTransactionEntity>>;
    findTransactionsByBuyOrderId(buyOrderId: string): Promise<Array<StockTransactionEntity>>;
    findTransactionsBySellOrderId(sellOrderId: string): Promise<Array<StockTransactionEntity>>;
    getAllTransactions(): Promise<Array<StockTransactionEntity>>;
    findRecentTransactions(minutes: number): Promise<Array<StockTransactionEntity>>;
    findTransactionsByDateRange(startDate: Date,endDate: Date): Promise<Array<StockTransactionEntity>>;

}