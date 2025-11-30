import { StockOrderEntity } from "../../../domain/entities/StockOrderEntity";
import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";
import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import { OrderBookService } from "../../ports/services/order/OrderBookService";

export class UpdateStockPriceUseCase {
    public constructor(
        private stockRepository: StockRepositoryInterface,
        private stockOrderRepository: StockOrderRepositoryInterface,
        private orderBookService: OrderBookService
    ) {}

    public async execute(stockSymbol: string): Promise<void | Error> {
        const stock = await this.stockRepository.findStockBySymbol(stockSymbol);
        if(stock instanceof Error) {
            return stock;
        }

        const orders = await this.stockOrderRepository.findPendingOrdersBySymbol(stockSymbol);
        if(orders instanceof Error) {
            return orders;
        }
        const buyOrders = orders.filter(o => o.orderType === "BUY");
        const sellOrders = orders.filter(o => o.orderType === "SELL");
          const equilibriumPrice = this.orderBookService.calculateEquilibriumPrice(buyOrders, sellOrders);
        if(equilibriumPrice === null) {
            return;
        }
         const previousPrice = stock.currentPrice;
        stock.previousPrice = previousPrice;
        stock.currentPrice = equilibriumPrice;
        stock.rateOfChange = ((equilibriumPrice - previousPrice) / previousPrice) * 100;
        stock.updatedAt = new Date();

        const updatedStock = await this.stockRepository.updateStock(stock);
        if(updatedStock instanceof Error) {
            return updatedStock;
        }
    }





}