import { StockEntity } from "../../../../domain/entities/StockEntity";
import { StockAlreadyExistsError } from "../../../errors/StockAlreadyExistsError";
import { StockNotFoundError } from "../../../errors/StockNotFoundError";

export interface StockRepositoryInterface {

    findStockById(id: string): Promise<StockEntity | StockNotFoundError | Error>
    findStockBySymbol(symbol: string): Promise<StockEntity | StockNotFoundError | Error>
    getAllStocks(): Promise<Array<StockEntity>>;
    getAvailableStocks(): Promise<Array<StockEntity>>
    createStock(stock: StockEntity): Promise<StockEntity | StockAlreadyExistsError | Error>
    updateStock(stock: StockEntity): Promise<StockEntity | StockNotFoundError | Error>
    deleteStock(id: string) : Promise<void | StockNotFoundError>;
}