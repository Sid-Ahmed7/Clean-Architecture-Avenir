import { StockEntity } from "../../../domain/entities/StockEntity";
import { StockRepositoryInterface } from "../../repositories/StockRepositoryInterface";

export class CreateStockUseCase {
    public constructor(private stockRepository: StockRepositoryInterface){}

    public async execute(stock: StockEntity): Promise<StockEntity | Error> {

        const existingStock = await this.stockRepository.findStockBySymbol(stock.symbol);
        
        if(existingStock instanceof Error) {
            return existingStock;
        }

        const createdStock = await this.stockRepository.createStock(stock);
        
        if(createdStock instanceof Error) {
            return createdStock;
        }

        return createdStock;
    
    }
}