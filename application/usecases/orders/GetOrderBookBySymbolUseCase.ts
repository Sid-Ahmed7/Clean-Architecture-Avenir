import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";
import { OrderBookResponse } from "../../responses/OrderBookResponse";
import { OrderTypeEnum } from "../../../domain/enums/OrderTypeEnum";

export class GetOrderBookBySymbolUseCase {
    public constructor(
        private readonly stockOrderRepository: StockOrderRepositoryInterface
    ) {}

    public async execute(symbol: string): Promise<OrderBookResponse | Error> {

            const orders = await this.stockOrderRepository.findActiveOrdersBySymbol(symbol);

            if (orders instanceof Error) {
                return orders;
            }

            const buyOrders = orders
                .filter(order => order.orderType === OrderTypeEnum.BUY)
                .sort((a, b) => b.orderPrice - a.orderPrice) 
                .slice(0, 10); 

            const sellOrders = orders
                .filter(order => order.orderType === OrderTypeEnum.SELL)
                .sort((a, b) => a.orderPrice - b.orderPrice) 

            return {
                symbol,
                buyOrders: buyOrders.map(order => ({
                    id: order.id,
                    price: order.orderPrice,
                    quantity: order.remainingQuantity,
                    createdAt: order.createdAt
                })),
                sellOrders: sellOrders.map(order => ({
                    id: order.id,
                    price: order.orderPrice,
                    quantity: order.remainingQuantity,
                    createdAt: order.createdAt
                }))
            };
        
    }
}
