import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { PositionNotFoundError } from "../../errors/PositionNotFoundError";
import { InvalidQuantityError } from "../../../domain/errors/InvalidQuantityError";

export class BlockSharesForOrderUseCase {
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
        
        const blockResult = position.blockShares(quantity);
        if (blockResult instanceof Error) {
            return blockResult;
        }
        
        await this.holdingRepository.updatePosition(position);
    }
}