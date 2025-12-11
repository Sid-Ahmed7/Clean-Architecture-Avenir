import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { PositionNotFoundError } from "../../errors/PositionNotFoundError";
import { InvalidQuantityError } from "../../../domain/errors/InvalidQuantityError";

export class UnblockSharesForOrderUseCase {
    public constructor(
        private holdingRepository: StockHoldingRepositoryInterface
    ) {}

    public async execute(
        userId: string, 
        stockSymbol: string, 
        quantity: number
    ): Promise<void | Error> {
        const position = await this.holdingRepository.findPositionByUserIdAndSymbol(
            userId, 
            stockSymbol
        );
        
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