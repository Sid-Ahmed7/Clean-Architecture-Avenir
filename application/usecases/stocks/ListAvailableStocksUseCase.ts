import { StockEntity } from "../../../domain/entities/StockEntity";
import {StockRepositoryInterface} from "../../ports/repositories/StockRepositoryInterface";
export class ListAvailableStocksUseCase {

    public constructor(private stockRepository: StockRepositoryInterface) {}

    public async execute(): Promise<Array<StockEntity> | Error> {

        const stocks = await this.stockRepository.getAllStocks();

        if(stocks instanceof Error) {
            return stocks;
        }

        const availableStocks = stocks.filter((stock) => stock.isActionAvailable);

        return availableStocks;


    }

}