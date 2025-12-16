import { StockOrderEntity } from "../../../../domain/entities/StockOrderEntity";
import { OrderMatch } from "../../../requests/OrderMatch";

export interface OrderBookService {
    calculateEquilibriumPrice(buyOrders: StockOrderEntity[], sellOrders: StockOrderEntity[]): number | null;
    findMatchableOrders(buyOrders: StockOrderEntity[], sellOrders: StockOrderEntity[]): Array<OrderMatch>;
    

}