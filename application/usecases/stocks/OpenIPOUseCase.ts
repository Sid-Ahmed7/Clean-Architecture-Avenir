import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import { StockEntity } from "../../../domain/entities/StockEntity";
import { IPOTypeEnum } from "../../../domain/enums/IPOTypeEnum";
import { IPONotActiveError } from "../../errors/IPONotActiveError";
import { InvalidIPOOperationError } from "../../../domain/errors/InvalidIPOOperationError";
import { AvailableSharesValue } from "../../../domain/values/AvailableSharesValue";


export class OpenIPOUseCase {

    public constructor(
        private readonly stockRepository: StockRepositoryInterface
    ) {}

    public async execute(stockSymbol: string, sharesToMakeAvailable?: number, ipoType?: IPOTypeEnum): Promise<StockEntity | Error> {
        const stock = await this.stockRepository.findStockBySymbol(stockSymbol);

        if (stock instanceof Error) {
            return stock;
        }

        if (stock.ipoActive) {
            return new IPONotActiveError("IPO is already active for this stock");
        }

        if (sharesToMakeAvailable !== undefined) {
            const validatedShares = AvailableSharesValue.from(sharesToMakeAvailable, stock.totalShares);
            if (validatedShares instanceof Error) {
                return validatedShares;
            }
            stock.availableSharesForIPO = validatedShares.value;
        }

        if (stock.availableSharesForIPO === 0) {
            return new InvalidIPOOperationError("Cannot open IPO with 0 shares available");
        }
        if(ipoType !== undefined) {
            stock.ipoType = ipoType;
        }
        stock.openIPO();

        const result = await this.stockRepository.updateStock(stock);
        if (result instanceof Error) {
            return result;
        }

        return stock;
    }
}
