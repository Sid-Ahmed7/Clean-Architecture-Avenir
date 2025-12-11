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

export class PlaceStockOrderUseCase {

    private readonly TRANSACTION_FEE = 1;

    public constructor(
        private stockOrderRepository: StockOrderRepositoryInterface,
        private stockRepository: StockRepositoryInterface,
        private orderValidationService: OrderValidationService,
        private uuidService: UuidGeneratorService,
        private accountService: AccountService,
        private holdingRepository: StockHoldingRepositoryInterface

    ) {}

    public async execute(userId: string , orderValidation: OrderValidation): Promise<StockOrderEntity | Error> {
        const stock = await this.stockRepository.findStockBySymbol(orderValidation.stockSymbol);

        if(stock instanceof Error) {
            return stock;
        }

        if (!stock.canBeTraded()) {
            return new StockNotAvailableError("This stock is not available for trading");
        }

        this.orderValidationService.validateOrder(orderValidation);

        if (orderValidation.orderType === OrderTypeEnum.BUY) {
            const totalAmount = (orderValidation.quantity * orderValidation.orderPrice) + this.TRANSACTION_FEE;
            const blockResult = await this.accountService.blockAccountFunds(userId, totalAmount);

            if (blockResult instanceof Error) {
                return blockResult;
            }
        }

        if (orderValidation.orderType === OrderTypeEnum.SELL) {
            const position = await this.holdingRepository.findPositionByUserIdAndSymbol(userId, orderValidation.stockSymbol);

            if (position instanceof Error) {
                return position;
            }

            if (!position.hasEnoughShares(orderValidation.quantity)) {
                return new Error(`Insufficient shares available. Available: ${position.getAvailableQuantity()}, required: ${orderValidation.quantity}`);
            }

            position.blockShares(orderValidation.quantity);
            await this.holdingRepository.updatePosition(position);
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