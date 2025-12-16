import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import { StockEntity } from "../../../domain/entities/StockEntity";
import { IPONotActiveError } from "../../errors/IPONotActiveError";


export class CloseIPOUseCase {

    public constructor(
        private readonly stockRepository: StockRepositoryInterface
    ) {}

    public async execute(stockSymbol: string): Promise<StockEntity | Error> {
        const stock = await this.stockRepository.findStockBySymbol(stockSymbol);

        if (stock instanceof Error) {
            return stock;
        }

        if (!stock.ipoActive) {
            return new IPONotActiveError("IPO is already closed for this stock");
        }

        stock.closeIPO();

        const result = await this.stockRepository.updateStock(stock);
        if (result instanceof Error) {
            return result;
        }

        return stock;
    }
}
