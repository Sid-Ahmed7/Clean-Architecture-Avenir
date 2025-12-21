import { StockEntity } from "../../../domain/entities/StockEntity";
import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";

export class ChangeStockAvailabilityUseCase {
    public constructor(private readonly stockRepository: StockRepositoryInterface){}


    public async execute(id: string, isAvailable: boolean): Promise<StockEntity | Error> {
        const stock = await this.stockRepository.findStockById(id);

        if (stock instanceof Error) {
            return stock;
        }

        if(isAvailable) {
            stock.makeActionAvailable();
        } else {
            stock.makeActionUnavailable();
        }

        const updatedStock = await this.stockRepository.updateStock(stock);

        if(updatedStock instanceof Error) {
            return updatedStock;
        }

        return updatedStock;
    }
}