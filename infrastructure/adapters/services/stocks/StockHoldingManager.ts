import { PositionNotFoundError } from "../../../../application/errors/PositionNotFoundError";
import { StockHoldingRepositoryInterface } from "../../../../application/ports/repositories/stocks/StockHoldingRepositoryInterface";
import { StockHoldingService } from "../../../../application/ports/services/stocks/StockHoldingService";

export class StockHoldingManager implements StockHoldingService {
    public constructor(private readonly stockHoldingRepository: StockHoldingRepositoryInterface){} 

    public async hasEnoughShares(userId: string, stockSymbol: string, quantity: number): Promise<boolean | PositionNotFoundError> {
        const position = await this.stockHoldingRepository.findPositionByUserIdAndSymbol(userId, stockSymbol);
        if(position instanceof Error) {
            return position;
        }

        return position.hasEnoughShares(quantity);
    }

    public async addShares(userId: string, stockSymbol: string, quantity: number, pricePerShare: number): Promise<void | PositionNotFoundError> {
        const position = await this.stockHoldingRepository.findPositionByUserIdAndSymbol(userId, stockSymbol);
        if(position instanceof Error) {
            return position;
        }

        position.addShares(quantity, pricePerShare);
        await this.stockHoldingRepository.updatePosition(position);
        return;
    }

    public async removeShares(userId: string, stockSymbol: string, quantity: number): Promise<void | PositionNotFoundError> {
        const position = await this.stockHoldingRepository.findPositionByUserIdAndSymbol(userId, stockSymbol);
        if(position instanceof Error) {
            return position;
        }

        position.removeShares(quantity);
        await this.stockHoldingRepository.updatePosition(position);
        return;
    }
}