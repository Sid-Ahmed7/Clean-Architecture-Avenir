import { StockEntity } from "../../../domain/entities/StockEntity";
import { StockRepositoryInterface } from "../../ports/repositories/StockRepositoryInterface";

export class UpdateStockUseCase {
    public constructor ( private stockRepository: StockRepositoryInterface){}

    public async execute(stock: StockEntity): Promise<StockEntity | Error> {

        const existingStock = await this.stockRepository.findStockById(stock.id)
        
        if(existingStock instanceof Error) {
            return existingStock;
        }

        const updatedStock = await this.stockRepository.updateStock(stock);
        
        if(updatedStock instanceof Error) {
            return updatedStock;
        }

        return updatedStock;    
    }
    
}