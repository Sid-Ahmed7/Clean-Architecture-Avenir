import { StockOrderEntity } from "../../../domain/entities/StockOrderEntity";
import { OrderValidation } from "../../requests/OrderValidation";
import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";
import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import { OrderValidationService } from "../../ports/services/order/OrderValidationService";
import { StockNotAvailableError } from "../../errors/StockNotAvailableError";
import { OrderStatusEnum } from "../../../domain/enums/OrderStatusEnum";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
export class PlaceStockOrderUseCase {

    private readonly TRANSACTION_FEE = 1;
    
    public constructor(
        private stockOrderRepository: StockOrderRepositoryInterface,
        private stockRepository: StockRepositoryInterface,
        private orderValidationService: OrderValidationService,
        private uuidService: UuidGeneratorService
        
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

        const id = this.uuidService.generate();


        const order = StockOrderEntity.from(id, userId, orderValidation.stockSymbol, orderValidation.quantity, orderValidation.orderPrice, this.TRANSACTION_FEE, orderValidation.orderType, OrderStatusEnum.PENDING, new Date(), new Date());

        if(order instanceof Error) {
            return order;
        }

        const createOrder = await this.stockOrderRepository.createOrder(order);

        if(createOrder instanceof Error) {
            return createOrder;
        }

        return createOrder;

    }
}