import { StockHoldingEntity } from "../../../domain/entities/StockHoldingEntity";
import { PositionNotFoundError } from "../../errors/PositionNotFoundError";
import { UpdateBuyer } from "../../requests/UpdateBuyer";
import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { StockHoldingService } from "../../ports/services/stocks/StockHoldingService";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";

export class UpdateBuyerPositionUseCase {
    public constructor(
        private holdingStockRepository: StockHoldingRepositoryInterface,
        private uuidService: UuidGeneratorService

    ){}

public async execute({userId,stockSymbol,quantity,pricePerShare}: UpdateBuyer): Promise<StockHoldingEntity | Error> {
        
        
        const existingPosition = await this.holdingStockRepository.findPositionByUserIdAndSymbol(userId, stockSymbol);

        if (!(existingPosition instanceof PositionNotFoundError)) {

            if(existingPosition instanceof Error) {
                return existingPosition;
            }

            const addResult = existingPosition.addShares(quantity, pricePerShare);
            if(addResult instanceof Error) {
                return addResult;
            }

            const updatePosition = await this.holdingStockRepository.updatePosition(existingPosition);
            if(updatePosition instanceof Error) {
                return updatePosition;
            }

            return existingPosition;
        }
        const totalInvested = quantity * pricePerShare;
        const id = this.uuidService.generate();

        const newPosition = StockHoldingEntity.from(id, userId, stockSymbol,quantity,pricePerShare, totalInvested, new Date(), new Date());

        if(newPosition instanceof Error) {
            return newPosition;
        }

        const createdPosition = await this.holdingStockRepository.createPosition(newPosition);

        if(createdPosition instanceof Error) {
            return createdPosition;
        }

        return createdPosition;



    }


}