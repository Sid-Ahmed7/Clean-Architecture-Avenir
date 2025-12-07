import { OrderTypeEnum } from "../../../domain/enums/OrderTypeEnum";
import { OrdersMatchResponse } from "../../responses/OrdersMatchResponse";
import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";
import { OrderBookService } from "../../ports/services/order/OrderBookService";

export class FindMatchableOrdersUseCase {
    

    constructor(
        private stockOrderRepository: StockOrderRepositoryInterface,
        private stockOrderService: OrderBookService
    ) {}

        public async execute(stockSymbol: string): Promise<Array<OrdersMatchResponse> | Error> {
            const orders = await this.stockOrderRepository.findPendingOrdersBySymbol(stockSymbol);
            if(orders instanceof Error) {
                return orders;
            }
            const buyOrders = orders.filter(o => o.orderType === OrderTypeEnum.BUY);
            const sellOrders = orders.filter(o => o.orderType === OrderTypeEnum.SELL);

            const matchableOrders = this.stockOrderService.findMatchableOrders(buyOrders, sellOrders);
            return matchableOrders.map(match => ({
                    buyOrderId: match.buy.id,
                    sellOrderId: match.sell.id
                }));
        }
}