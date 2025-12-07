import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";

export class DeleteStockUseCase {
    public constructor(private readonly stockRepository: StockRepositoryInterface){}

    public async execute(id: string): Promise<void | Error> {

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