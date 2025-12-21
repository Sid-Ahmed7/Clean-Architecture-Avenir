import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
export class BlockSharesForOrderUseCase {
    public constructor(private readonly holdingRepository: StockHoldingRepositoryInterface) {}

    public async execute(userId: string,stockSymbol: string,quantity: number): Promise<void | Error> {
        const position = await this.holdingRepository.findPositionByUserIdAndSymbol(userId,stockSymbol);
        
        if (position instanceof Error) {
            return position;
        }
        
        const blockResult = position.blockShares(quantity);
        
        if (blockResult instanceof Error) {
            return blockResult;
        }
        
        const updatePosition = await this.holdingRepository.updatePosition(position);
        
        if( updatePosition instanceof Error) {
            return updatePosition;
        }
    }
}