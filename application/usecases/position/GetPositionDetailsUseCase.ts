import { PositionDetails } from "../../interfaces/PositionDetails";
import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";

export class GetPositionDetailsUseCase {

    public constructor(
        private holdingRepository: StockHoldingRepositoryInterface,
        private  stockRepository: StockRepositoryInterface
    ){}

    public async execute(userId: string, stockSymbol: string): Promise<PositionDetails | Error> {

        const position = await this.holdingRepository.findPositionByUserIdAndSymbol(userId, stockSymbol);
        if(position instanceof Error) {
            return position;
        }

        const stock = await this.stockRepository.findStockBySymbol(stockSymbol);

        if(stock instanceof Error) {
            return stock;
        }
        
        const currentPrice = stock.currentPrice;
        const currentValue = position.calculateCurrentValue(currentPrice);
        const profitLoss = position.calculateProfitLoss(currentPrice);
        const profitLossPercent = position.calculateProfitLossPercent(currentPrice);

        return {
            position,
            currentPrice,
            currentValue,
            profitLoss,
            profitLossPercent
        };
    }
}