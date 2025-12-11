import { StockEntity } from "../../../domain/entities/StockEntity";
import { StockAlreadyExistsError } from "../../errors/StockAlreadyExistsError";
import { StockNotFoundError } from "../../errors/StockNotFoundError";
import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import {CreateStock} from "../../requests/CreateStock";


export class CreateStockUseCase {
    public constructor(private readonly stockRepository: StockRepositoryInterface, private readonly uuidService: UuidGeneratorService){}

    public async execute(stock: CreateStock): Promise<StockEntity | Error> {

        const existingStock = await this.stockRepository.findStockBySymbol(stock.symbol);
        
        if(!(existingStock instanceof StockNotFoundError)) {
            return new StockAlreadyExistsError("Stock already exists");

        }
        const id = this.uuidService.generate();
        const stockEntity = StockEntity.from(id, stock.symbol, stock.companyName, stock.name, stock.currentPrice, stock.previousPrice ?? stock.currentPrice, stock.currency, new Date(), stock.isActionAvailable, new Date());
        if(stockEntity instanceof Error) {
            return stockEntity;
        }
 
        const createdStock = await this.stockRepository.createStock(stockEntity);
        
        if(createdStock instanceof Error) {
            return createdStock;
        }

        return createdStock;
    
    }
}