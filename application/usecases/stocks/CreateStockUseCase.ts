import { StockEntity } from "../../../domain/entities/StockEntity";
import { StockAlreadyExistsError } from "../../../domain/errors/StockAlreadyExistsError";
import { StockNotFoundError } from "../../../domain/errors/StockNotFoundError";
import { StockRepositoryInterface } from "../../ports/repositories/StockRepositoryInterface";

export class CreateStockUseCase {
    public constructor(private stockRepository: StockRepositoryInterface){}

    public async execute(stock: StockEntity): Promise<StockEntity | Error> {

        const existingStock = await this.stockRepository.findStockBySymbol(stock.symbol);
        
        if(!(existingStock instanceof StockNotFoundError)) {
            return new StockAlreadyExistsError("Stock already exists");

        }

        const createdStock = await this.stockRepository.createStock(stock);
        
        if(createdStock instanceof Error) {
            return createdStock;
        }

        return createdStock;
    
    }
}