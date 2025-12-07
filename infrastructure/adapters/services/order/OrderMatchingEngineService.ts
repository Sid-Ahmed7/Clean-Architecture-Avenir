import { MatchDetails } from "../../../../application/responses/MatchDetails";
import { OrderMatchingService } from "../../../../application/ports/services/order/OrderMatchingService";
import { StockOrderEntity } from "../../../../domain/entities/StockOrderEntity";
import { OrderMatchingError } from "../../../../domain/errors/OrderMatchingError";

export class OrderMatchingEngineService implements OrderMatchingService {

    public determineMatchDetails(buyOrder: StockOrderEntity, sellOrder: StockOrderEntity): MatchDetails | OrderMatchingError {
        
        if(!buyOrder.canMatchWithAnotherOrder(sellOrder)) {
            return new OrderMatchingError("Orders cannot be matched");
        }

        const quantity = Math.min(buyOrder.remainingQuantity, sellOrder.remainingQuantity);
        const executionPrice = sellOrder.orderPrice;

        return {quantity, executionPrice};
    }
}