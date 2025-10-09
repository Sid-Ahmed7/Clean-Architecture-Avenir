import { StockRepositoryInterface } from "../../ports/repositories/StockRepositoryInterface";

export class GetAllStockUseCase {

    public constructor(private stockRepository: StockRepositoryInterface) {}

    public async execute() {

        const stocks = await this.stockRepository.getAllStocks();

        if(stocks instanceof Error) {
            return stocks;
        }

        return stocks;
    }

}