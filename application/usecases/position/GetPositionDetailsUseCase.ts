import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import { PositionWithDetails } from "../../responses/PositionWithDetails";

export class GetPositionDetailsUseCase {

    public constructor(private readonly holdingRepository: StockHoldingRepositoryInterface, private readonly  stockRepository: StockRepositoryInterface){}

    public async execute(userId: string, stockSymbol: string): Promise<PositionWithDetails | Error> {

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
            id: position.id,
            userId: position.userId,
            stockSymbol: position.stockSymbol,
            quantity: position.quantity,
            averagePurchasePrice: position.averagePurchasePrice,
            totalInvested: position.totalInvested,
            createdAt: position.createdAt,
            updatedAt: position.updatedAt,
            ...(position.blockQuantity !== undefined && { blockQuantity: position.blockQuantity }),
            currentPrice,
            currentValue,
            profitLoss,
            profitLossPercent,
            stockName: stock.name,
        };
    }
}