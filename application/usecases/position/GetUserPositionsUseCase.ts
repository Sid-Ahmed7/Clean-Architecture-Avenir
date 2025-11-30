import { StockHoldingEntity } from "../../../domain/entities/StockHoldingEntity";
import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";

export class GetUserPositionsUseCase {
    
    constructor(private holdingRepository: StockHoldingRepositoryInterface) {}

    public async execute(userId: string): Promise<StockHoldingEntity[] | Error> {
        const positions = await this.holdingRepository.findPositionsByUserId(userId);
        
        if (positions instanceof Error) {
            return positions;
        }

        return positions;
    }
}