import { OrderStatusEnum } from "../enums/OrderStatusEnum";
import { OrderTypeEnum } from "../enums/OrderTypeEnum";
import { FeeValue } from "../values/FeeValue";
import { QuantityValue } from "../values/QuantityValue";
import { StockSymbolValue } from "../values/StockSymbolValue";
import { UserIdValue } from "../values/UserIdValue";
import { PriceValue} from "../values/PriceValue";
import { InvalidPriceError } from "../errors/InvalidPriceError";
import { InvalidQuantityError } from "../errors/InvalidQuantityError";
import { InvalidCancelledOrder } from "../errors/InvalidCancelledOrder";

export class StockOrderEntity {
    public static from(id: string,userId: string, stockSymbol: string, quantity: number, orderPrice: number, fee: number, orderType: OrderTypeEnum, orderStatus: OrderStatusEnum, createdAt: Date, updatedAt: Date, executedAt?: Date, remainingQuantity?: number) {

        const validatedSymbol = StockSymbolValue.from(stockSymbol);
        if(validatedSymbol instanceof Error) {
            return validatedSymbol;
        }

        const validatedUserId = UserIdValue.from(userId);
        if(validatedUserId instanceof Error) {
            return validatedUserId;
        }

        const validatedQuantity = QuantityValue.from(quantity);
        if(validatedQuantity instanceof Error) {
            return validatedQuantity;
        }

        const validatedFee = FeeValue.from(fee);
        if(validatedFee instanceof Error) {
            return validatedFee;
        }

        const validatedOrderPrice = PriceValue.from(orderPrice);
        if(validatedOrderPrice instanceof Error) {
            return validatedOrderPrice;
        }

        return new StockOrderEntity(id,validatedUserId.value, validatedSymbol.value, validatedQuantity.value, validatedOrderPrice.value, validatedFee.value, orderType, orderStatus, createdAt, updatedAt, executedAt,remainingQuantity);  
        
    }

    private constructor(
        public id: string,
        public userId: string,
        public stockSymbol: string,
        public quantity: number,
        public orderPrice: number,
        public fee: number,
        public orderType: OrderTypeEnum,
        public orderStatus: OrderStatusEnum,
        public createdAt: Date,
        public updatedAt: Date,
        public executedAt?: Date,
        public remainingQuantity: number = quantity
    ) {}


    public executePartially(executedQuantity: number): InvalidQuantityError | void {
        if(executedQuantity <= 0 ) {
            return new InvalidQuantityError("Executed quantity must be positive");
        }
        if(executedQuantity > this.remainingQuantity) {
            return new InvalidQuantityError("Cannot execute more than remaining quantity");
        }

        this.remainingQuantity -= executedQuantity;

        if(this.remainingQuantity <= 0) {
            this.orderStatus = OrderStatusEnum.EXECUTED;
            this.executedAt = new Date();
            this.updatedAt = new Date();
        } else {
            this.orderStatus = OrderStatusEnum.PARTIALLY_EXECUTED;
        }

        this.updatedAt = new Date();
    }

      public executeCompletely(): void {
        this.remainingQuantity = 0;
        this.orderStatus = OrderStatusEnum.EXECUTED;
        this.executedAt = new Date();
        this.updatedAt = new Date();
    }

    public cancel(): InvalidCancelledOrder | void {
        if (this.orderStatus === OrderStatusEnum.EXECUTED) {
            return new InvalidCancelledOrder("Cannot cancel an executed order");
        }
        
        this.orderStatus = OrderStatusEnum.CANCELLED;
        this.updatedAt = new Date();
    }

    public getTotalCost(): number {
        return (this.quantity * this.orderPrice) + this.fee;
    }

    public getNetRevenue(): number {
        return (this.quantity * this.orderPrice) - this.fee;
    }

    public canMatchWithAnotherOrder(order: StockOrderEntity): boolean {
        if(this.stockSymbol !== order.stockSymbol) {
            return false;
        }
        
        if(this.orderType === order.orderType) {
            return false;
        }
        
        if(!this.isActive() || !order.isActive()) {
            return false;
        }

        if(this.orderType === OrderTypeEnum.BUY) {
            return this.orderPrice >= order.orderPrice;
        } else {
            return this.orderPrice <= order.orderPrice;

        }
    }

    public isActive(): boolean {
        return this.orderStatus === OrderStatusEnum.PENDING || this.orderStatus === OrderStatusEnum.PARTIALLY_EXECUTED;
    }

     public getExecutedQuantity(): number {
        return this.quantity - this.remainingQuantity;
    }

     public belongsToUser(userId: string): boolean {
        return this.userId === userId;
    }

    public isOrderCanCancelled() : boolean {
        return this.orderStatus === OrderStatusEnum.PENDING || this.orderStatus === OrderStatusEnum.PARTIALLY_EXECUTED;
    }
}
