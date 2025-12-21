import { StockEntity } from "../../../../domain/entities/StockEntity";
import { StockAlreadyExistsError } from "../../../errors/StockAlreadyExistsError";
import { StockNotFoundError } from "../../../errors/StockNotFoundError";

export interface StockRepositoryInterface {

    findStockById(id: string): Promise<StockEntity | StockNotFoundError>
    findStockBySymbol(symbol: string): Promise<StockEntity | StockNotFoundError>
    getAllStocks(): Promise<Array<StockEntity>>;
    getAvailableStocks(): Promise<Array<StockEntity>>
    createStock(stock: StockEntity): Promise<StockEntity | StockAlreadyExistsError>
    updateStock(stock: StockEntity): Promise<StockEntity | StockNotFoundError>
    deleteStock(id: string) : Promise<void | StockNotFoundError>;
}