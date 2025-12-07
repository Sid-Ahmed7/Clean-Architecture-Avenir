import { StockHoldingEntity } from "../../../domain/entities/StockHoldingEntity";
import { PositionNotFoundError } from "../../errors/PositionNotFoundError";
import { UpdateSeller } from "../../requests/UpdateSeller";
import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";

export class UpdatedSellerPositionUseCase {
    public constructor(
        private holdingStockRepository: StockHoldingRepositoryInterface,
    ){}

public async execute(seller: UpdateSeller): Promise<StockHoldingEntity | Error> {
                
        const position = await this.holdingStockRepository.findPositionByUserIdAndSymbol(seller.userId,seller.stockSymbol);
        
        if(position instanceof Error) {
            return position;
        }

        const removeResult = position.removeShares(seller.quantity);
        if( removeResult instanceof Error) {
            return removeResult;
        }

        if(position.isEmpty()) {
        const deletePosition = await this.holdingStockRepository.deletePosition(position.id);
        if(deletePosition instanceof Error) {
            return deletePosition;
        }
        return position;
       }
       

        
        const updatePosition = await this.holdingStockRepository.updatePosition(position);
        if(updatePosition instanceof Error) {
            return updatePosition;
        }

        return updatePosition;
    }
}