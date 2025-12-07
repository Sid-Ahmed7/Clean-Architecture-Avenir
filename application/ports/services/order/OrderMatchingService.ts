import { StockOrderEntity } from "../../../../domain/entities/StockOrderEntity";
import { OrderMatchingError } from "../../../../domain/errors/OrderMatchingError";
import { MatchDetails } from "../../../responses/MatchDetails";

export interface OrderMatchingService {
    determineMatchDetails(buyOrder: StockOrderEntity, sellOrder: StockOrderEntity): MatchDetails | OrderMatchingError
}