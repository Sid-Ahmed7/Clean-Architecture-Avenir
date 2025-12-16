import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import {PositionWithDetails} from "../../responses/PositionWithDetails";
export class GetUserPositionsUseCase {

    constructor(private readonly holdingRepository: StockHoldingRepositoryInterface, private readonly stockRepository: StockRepositoryInterface) {}

    public async execute(userId: string): Promise<PositionWithDetails[] | Error> {
        const positions = await this.holdingRepository.findPositionsByUserId(userId);

        if (positions instanceof Error) {
            return positions;
        }
        const enrichedPositions: PositionWithDetails[] = [];

        for (const position of positions) {
            const stock = await this.stockRepository.findStockBySymbol(position.stockSymbol);
            if (stock instanceof Error) {
                return stock;
            }

            const currentPrice = stock.currentPrice;
            const currentValue = position.calculateCurrentValue(currentPrice);
            const profitLoss = position.calculateProfitLoss(currentPrice);
            const profitLossPercent = position.calculateProfitLossPercent(currentPrice);

            enrichedPositions.push({
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
            });
        }

        return enrichedPositions;
    }
}