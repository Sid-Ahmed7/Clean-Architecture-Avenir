import { StockEntity } from "../../../domain/entities/StockEntity";
import { StockRepositoryInterface } from "../../ports/repositories/StockRepositoryInterface";

export class GetStockBySymbolUseCase {

    public constructor(private stockRepository: StockRepositoryInterface) {}

    public async execute(symbol: string) : Promise<StockEntity | Error> {

        const stock = await this.stockRepository.findStockBySymbol(symbol);

        if(stock instanceof Error) {
            return stock;
        }

        return stock;
    }

}