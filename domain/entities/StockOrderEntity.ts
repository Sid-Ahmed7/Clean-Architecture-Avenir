import { OrderStatusEnum } from "../enums/OrderStatusEnum";
import { OrderTypeEnum } from "../enums/OrderTypeEnum";
import { FeeValue } from "../values/FeeValue";
import { QuantityValue } from "../values/QuantityValue";
import { StockSymbolValue } from "../values/StockSymbolValue";
import { UserIdValue } from "../values/UserIdValue";

export class StockOrderEntity {
    public static from( userId: string, stockSymbol: string, quantity: number, orderPrice: number, fee: number, orderType: OrderTypeEnum, orderStatus: OrderStatusEnum, createdAt: Date) {

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

        return new StockOrderEntity(validatedUserId.value, validatedSymbol.value, validatedQuantity.value, orderPrice, validatedFee.value, orderType, orderStatus, createdAt);  
        
    }

    private constructor(
        public userId: string,
        public stockSymbol: string,
        public quantity: number,
        public orderPrice: number,
        public fee: number,
        public orderType: OrderTypeEnum,
        public orderStatus: OrderStatusEnum,
        public createdAt: Date
    ) {}

}