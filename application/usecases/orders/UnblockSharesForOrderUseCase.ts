import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";


export class UnblockSharesForOrderUseCase {
    public constructor(private readonly holdingRepository: StockHoldingRepositoryInterface) {}

    public async execute(userId: string,stockSymbol: string,quantity: number): Promise<void | Error> {
        const position = await this.holdingRepository.findPositionByUserIdAndSymbol(userId,stockSymbol);
        
        if (position instanceof Error) {
            return position;
        }
        
        const unblockResult = position.unblockShares(quantity);
        if (unblockResult instanceof Error) {
            return unblockResult;
        }
        
        await this.holdingRepository.updatePosition(position);
    }
}