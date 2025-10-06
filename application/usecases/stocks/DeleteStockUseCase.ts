import { StockRepositoryInterface } from "../../ports/repositories/StockRepositoryInterface";

export class DeleteStockUseCase {
    public constructor(private stockRepository: StockRepositoryInterface){}

    public async execute(id: number): Promise<void | Error> {

        const existingStock = await this.stockRepository.findStockById(id);
        
        if(existingStock instanceof Error) {
            return existingStock;
        }

        const deleteStock = await this.stockRepository.deleteStock(id);
        
        if(deleteStock instanceof Error) {
            return deleteStock;
        }    
    }
}