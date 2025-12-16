import { StockOrderEntity } from "../../../domain/entities/StockOrderEntity";
import { OrderValidation } from "../../requests/OrderValidation";
import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";
import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import { OrderValidationService } from "../../ports/services/order/OrderValidationService";
import { StockNotAvailableError } from "../../errors/StockNotAvailableError";
import { OrderStatusEnum } from "../../../domain/enums/OrderStatusEnum";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { AccountService } from "../../ports/services/AccountService";
import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { OrderTypeEnum } from "../../../domain/enums/OrderTypeEnum";
import { IPOTypeEnum } from "../../../domain/enums/IPOTypeEnum";
import { InsufficientIPOSharesError } from "../../errors/InsufficientIPOSharesError";
import { IPONotActiveError } from "../../errors/IPONotActiveError";
import { InsufficientAvailableSharesError } from "../../errors/InsufficientAvailableSharesError";
export class PlaceStockOrderUseCase {

    private readonly TRANSACTION_FEE = 1;

    public constructor(
        private readonly stockOrderRepository: StockOrderRepositoryInterface,
        private readonly stockRepository: StockRepositoryInterface,
        private readonly orderValidationService: OrderValidationService,
        private readonly uuidService: UuidGeneratorService,
        private readonly accountService: AccountService,
        private readonly holdingRepository: StockHoldingRepositoryInterface

    ) {}

    public async execute(userId: string , orderValidation: OrderValidation): Promise<StockOrderEntity | Error> {
        const stock = await this.stockRepository.findStockBySymbol(orderValidation.stockSymbol);

        if(stock instanceof Error) {
            return stock;
        }

        if (!stock.canBeTraded()) {
            return new StockNotAvailableError("This stock is not available for trading");
        }

        if (orderValidation.orderType === OrderTypeEnum.BUY && stock.isIPOActive() && stock.ipoType === IPOTypeEnum.INITIAL) {
            return new IPONotActiveError(`Cannot place regular buy order while IPO is active. ${stock.getAvailableIPOShares()} shares available at ${stock.currentPrice}€.`);
        }


        this.orderValidationService.validateOrder(orderValidation);

        if (orderValidation.orderType === OrderTypeEnum.BUY) {
            const pendingOrders = await this.stockOrderRepository.findPendingOrdersBySymbol(orderValidation.stockSymbol);
            if (!(pendingOrders instanceof Error)) {
                const totalPendingBuyQuantity = pendingOrders
                    .filter(order => order.orderType === OrderTypeEnum.BUY && order.userId !== userId)
                    .reduce((sum, order) => sum + order.remainingQuantity, 0);

                const totalRequestedQuantity = totalPendingBuyQuantity + orderValidation.quantity;

                if (totalRequestedQuantity > stock.totalShares) {
                    return new InsufficientIPOSharesError(`Insufficient shares available. Total shares: ${stock.totalShares}, Already requested: ${totalPendingBuyQuantity}, Your request: ${orderValidation.quantity}`);
                }
            }

            const totalAmount = (orderValidation.quantity * orderValidation.orderPrice) + this.TRANSACTION_FEE;
            const blockResult = await this.accountService.blockAccountFunds(userId, totalAmount);

            if (blockResult instanceof Error) {
                return blockResult;
            }
        }

        if (orderValidation.orderType === OrderTypeEnum.SELL) {
            const position = await this.holdingRepository.findPositionByUserIdAndSymbol(userId, orderValidation.stockSymbol);

            if (!(position instanceof Error)) {
                if (!position.hasEnoughShares(orderValidation.quantity)) {
                    return new InsufficientAvailableSharesError(`Insufficient shares available. Available: ${position.getAvailableQuantity()}, required: ${orderValidation.quantity}`);
                }

                position.blockShares(orderValidation.quantity);
                await this.holdingRepository.updatePosition(position);
            }
        }

        const id = this.uuidService.generate();

        const order = StockOrderEntity.from(id, userId, orderValidation.stockSymbol, orderValidation.quantity, orderValidation.orderPrice, this.TRANSACTION_FEE, orderValidation.orderType, OrderStatusEnum.PENDING, new Date(), new Date());

        if(order instanceof Error) {
            if (orderValidation.orderType === OrderTypeEnum.BUY) {
                const totalAmount = (orderValidation.quantity * orderValidation.orderPrice) + this.TRANSACTION_FEE;
                await this.accountService.unblockAccountFunds(userId, totalAmount);
            } else if (orderValidation.orderType === OrderTypeEnum.SELL) {
                const position = await this.holdingRepository.findPositionByUserIdAndSymbol(userId, orderValidation.stockSymbol);
                if (!(position instanceof Error)) {
                    position.unblockShares(orderValidation.quantity);
                    await this.holdingRepository.updatePosition(position);
                }
            }
            return order;
        }

        const createOrder = await this.stockOrderRepository.createOrder(order);

        if(createOrder instanceof Error) {
            if (orderValidation.orderType === OrderTypeEnum.BUY) {
                const totalAmount = (orderValidation.quantity * orderValidation.orderPrice) + this.TRANSACTION_FEE;
                await this.accountService.unblockAccountFunds(userId, totalAmount);
            } else if (orderValidation.orderType === OrderTypeEnum.SELL) {
                const position = await this.holdingRepository.findPositionByUserIdAndSymbol(userId, orderValidation.stockSymbol);
                if (!(position instanceof Error)) {
                    position.unblockShares(orderValidation.quantity);
                    await this.holdingRepository.updatePosition(position);
                }
            }
            return createOrder;
        }

        return createOrder;

    }
}