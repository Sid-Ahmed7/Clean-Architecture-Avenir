import { StockEntity } from "../../domain/entities/StockEntity";
import { StockAlreadyExistsError } from "../../domain/errors/StockAlreadyExistsError";
import { StockNotFoundError } from "../../domain/errors/StockNotFoundError";

export interface StockRepositoryInterface {

    findStockById(id: number): Promise<StockEntity | StockNotFoundError>
    findStockBySymbol(symbol: string): Promise<StockEntity | StockNotFoundError>
    getAllStocks(): Promise<Array<StockEntity>>;
    createStock(stock: StockEntity): Promise<StockEntity | StockAlreadyExistsError>
    updateStock(stock: StockEntity): Promise<StockEntity | StockNotFoundError>
    deleteStock(id: number) : Promise<void | StockNotFoundError>;
}