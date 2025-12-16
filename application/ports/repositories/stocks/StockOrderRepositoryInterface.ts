import { StockOrderEntity } from "../../../../domain/entities/StockOrderEntity";
import { OrderStatusEnum } from "../../../../domain/enums/OrderStatusEnum";
import { InvalidOrderError } from "../../../../domain/errors/InvalidOrderError";
import { OrderNotFoundError } from "../../../errors/OrderNotFoundError";
export interface StockOrderRepositoryInterface {
    createOrder(order: StockOrderEntity): Promise<StockOrderEntity | InvalidOrderError>
    updateOrder(order: StockOrderEntity): Promise<StockOrderEntity | OrderNotFoundError>
    deleteOrder(id: string): Promise<void | OrderNotFoundError>;
    findOrderById(id: string): Promise<StockOrderEntity | OrderNotFoundError>;
    findOrdersByUserId(userId: string): Promise<Array<StockOrderEntity>>;
    findPendingOrdersBySymbol(symbol: string): Promise<Array<StockOrderEntity>>;
    findAllOrders(): Promise<Array<StockOrderEntity>>;
    findActiveOrders(): Promise<Array<StockOrderEntity>>;
    findActiveOrdersByUserId(userId: string): Promise<Array<StockOrderEntity>>;
    findActiveOrdersBySymbol(symbol: string): Promise<Array<StockOrderEntity> | Error>;
    findOrdersByStatus(status: OrderStatusEnum): Promise<Array<StockOrderEntity>>;
    findOrdersByUserIdAndSymbol(userId: string, symbol: string): Promise<Array<StockOrderEntity>>;

}