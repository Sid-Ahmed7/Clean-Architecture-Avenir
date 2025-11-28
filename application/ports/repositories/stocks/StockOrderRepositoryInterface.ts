import { StockOrderEntity } from "../../../../domain/entities/StockOrderEntity";
import { OrderStatusEnum } from "../../../../domain/enums/OrderStatusEnum";
import { InvalidOrderError } from "../../../../domain/errors/InvalidOrderError";
import { OrderNotFoundError } from "../../../errors/OrderNotFoundError";
export interface StockOrderRepositoryInterface {
    createOrder(order: StockOrderEntity): Promise<StockOrderEntity | InvalidOrderError>
    updateOrder(order: StockOrderEntity): Promise<StockOrderEntity | OrderNotFoundError>
    deleteOrder(id: number): Promise<StockOrderEntity | OrderNotFoundError>;
    findOrderById(id: number): Promise<StockOrderEntity | OrderNotFoundError>;
    findOrderById(userId: string): Promise<Array<StockOrderEntity>>;
    findOrdersByUserId(userId: string): Promise<StockOrderEntity[] | OrderNotFoundError>;
    findPendingOrdersBySymbol(symbol: string): Promise<Array<StockOrderEntity>>;
    findActiveOrders(): Promise<Array<StockOrderEntity>>;
    findActiveOrdersByUserId(userId: string): Promise<Array<StockOrderEntity>>;
    findOrdersByStatus(status: OrderStatusEnum): Promise<Array<StockOrderEntity>>;
    findOrdersByUserIdAndSymbol(userId: string, symbol: string): Promise<Array<StockOrderEntity>>;






}