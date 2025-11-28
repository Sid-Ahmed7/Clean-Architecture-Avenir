import { OrderMatch } from "../../../../application/interfaces/OrderMatch";
import { OrderBookService } from "../../../../application/ports/services/order/OrderBookService";
import { StockOrderEntity } from "../../../../domain/entities/StockOrderEntity";

export class OrderBookEngineService implements OrderBookService {

    public calculateEquilibriumPrice(buyOrders: StockOrderEntity[], sellOrders: StockOrderEntity[]): number | null {
        if(buyOrders.length === 0 || sellOrders.length === 0) {
            return null;
        }

        const activeBuyOrders = buyOrders.filter((order) => order.isActive()).sort((a,b) => a.orderPrice - b.orderPrice);
        const activeSellOrders = buyOrders.filter((order) => order.isActive()).sort((a,b) => a.orderPrice - b.orderPrice);

        if(activeBuyOrders.length === 0 || activeSellOrders.length === 0) {
            return null;
        }

        const bestPrice = activeBuyOrders[0].orderPrice;
        const bestAsk = activeSellOrders[0].orderPrice;

        if(bestPrice < bestAsk) {
            return null;
        }

        return (bestPrice + bestAsk) / 2;
    }

    public findMatchableOrders(buyOrders: StockOrderEntity[], sellOrders: StockOrderEntity[]): Array<OrderMatch> {
        const matches: Array<OrderMatch> = [];

        const activeBuyOrders = buyOrders.filter(order => order.isActive()).sort((a, b) => {
            if (b.orderPrice != a.orderPrice) {
                return b.orderPrice - a.orderPrice;
            }

            return a.createdAt.getTime() - b.createdAt.getTime();
        })

        const activeSellOrders = sellOrders.filter(order => order.isActive()).sort((a, b) => {
            if (b.orderPrice != a.orderPrice) {
                return b.orderPrice - a.orderPrice;
            }

            return a.createdAt.getTime() - b.createdAt.getTime();
        })

        for (const buyOrder of activeBuyOrders) {
            for(const sellOrder of activeSellOrders) {
                if (buyOrder.canMatchWithAnotherOrder(sellOrder)) {
                    matches.push({buy: buyOrder, sell: sellOrder})
                }
            }
        }
        return matches;
    }
}