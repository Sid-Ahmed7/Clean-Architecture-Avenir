import { OrderNotFoundError } from "../../../application/errors/OrderNotFoundError";
import { StockOrderRepositoryInterface } from "../../../application/ports/repositories/stocks/StockOrderRepositoryInterface";
import { StockOrderEntity } from "../../../domain/entities/StockOrderEntity";
import { OrderStatusEnum } from "../../../domain/enums/OrderStatusEnum";
import { InvalidOrderError } from "../../../domain/errors/InvalidOrderError";
import { InvalidUserIdError } from "../../../domain/errors/InvalidUserIdError";

export class InMemoryStockOrderRepository implements StockOrderRepositoryInterface {

    private orders: Array<StockOrderEntity>;
    private incrId: number;

    public constructor() {
        this.orders = [];
        this.incrId = 0;
    }

    public async findOrderById(id: number): Promise<StockOrderEntity | OrderNotFoundError> {
        const order = this.orders.find((o) => o.id === id);
        if(!order) {
            return new OrderNotFoundError(`Order with ID ${id} not found`);
        }

        return order;
    }

    public async findOrdersByUserId(userId: string): Promise<StockOrderEntity[]> {
         return this.orders.filter(o => o.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    public async findPendingOrdersBySymbol(symbol: string): Promise<Array<StockOrderEntity>> {
        return this.orders.filter(o => o.stockSymbol === symbol.toUpperCase() && o.orderStatus === OrderStatusEnum.PENDING).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    public async findActiveOrders(): Promise<Array<StockOrderEntity>> {
        return this.orders.filter(o => o.isActive());
    }

    public async findOrdersByUserIdAndSymbol(userId: string, symbol: string): Promise<Array<StockOrderEntity>> {
         return this.orders.filter(o => o.userId === userId && o.stockSymbol === symbol);
    }

    public async findActiveOrdersByUserId(userId: string): Promise<Array<StockOrderEntity>> {
        return this.orders.filter(o => o.userId === userId && o.isActive());

    }

    public async findOrdersByStatus(status: OrderStatusEnum): Promise<Array<StockOrderEntity>> {
        return this.orders.filter(o => o.orderStatus === status);
    }


    public async createOrder(order: StockOrderEntity): Promise<StockOrderEntity | InvalidOrderError> {
        if(!order) {
            return new InvalidOrderError("Invalid order");
        }

        this.incrId++,
        order.id = this.incrId;
        this.orders.push(order);

        return order;
    }

    public async updateOrder(order: StockOrderEntity): Promise<StockOrderEntity | OrderNotFoundError> {
         const index = this.orders.findIndex(o => o.id === order.id);
        if (index === -1){
            return new OrderNotFoundError(`Order with ID ${order.id} not found`);
        }

        this.orders[index] = order;
        return order;
    }
    public async deleteOrder(id: number): Promise<void | OrderNotFoundError> {
        const index = this.orders.findIndex(o => o.id === id);
        if (index === -1){
            return new OrderNotFoundError(`Order with ID ${id} not found`);
        }
        this.orders.splice(index, 1)[0];
    }
}