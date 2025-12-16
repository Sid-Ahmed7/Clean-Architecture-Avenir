import { FeeValue } from "../values/FeeValue";
import { PriceValue } from "../values/PriceValue";
import { QuantityValue } from "../values/QuantityValue";
import { StockSymbolValue } from "../values/StockSymbolValue";
import { UserIdValue } from "../values/UserIdValue";
import { TransactionIdValue } from "../values/TransactionIdValue";
import { OrderIdValue } from "../values/OrderIdValue";
import { ExecutionPriceValue } from "../values/ExecutionPriceValue";


export class StockTransactionEntity {

    public static from(id: string, buyOrderId: string, sellOrderId: string, stockSymbol: string, quantity: number, executionPrice: number, buyerUserId: string, sellerUserId: string, buyerFee: number, sellerFee: number, executedAt: Date) {
        const validatedSymbol = StockSymbolValue.from(stockSymbol);
            if(validatedSymbol instanceof Error) {
                return validatedSymbol;
        }
        
        const validatedBuyerUserId = UserIdValue.from(buyerUserId);
            if(validatedBuyerUserId instanceof Error) {
                return validatedBuyerUserId;
        }

        const validatedSellerUserId = UserIdValue.from(sellerUserId);
            if(validatedSellerUserId instanceof Error) {
                return validatedSellerUserId;
        }
        
        const validatedQuantity = QuantityValue.from(quantity);
            if(validatedQuantity instanceof Error) {
                return validatedQuantity;
        }

        const validatedPrice = PriceValue.from(executionPrice);
            if (validatedPrice instanceof Error) {
                return validatedPrice;
            }
        

        const validatedByerFee = FeeValue.from(buyerFee);
        if(validatedByerFee instanceof Error) {
            return validatedByerFee;
        } 

        const validatedSellerFee = FeeValue.from(sellerFee);
        if(validatedSellerFee instanceof Error) {
            return validatedSellerFee;
        } 
        const validatedTransactionId = TransactionIdValue.from(id);
        if (validatedTransactionId instanceof Error){
            return validatedTransactionId;
        }

        const validatedBuyOrderId = OrderIdValue.from(buyOrderId);
        if (validatedBuyOrderId instanceof Error){
            return validatedBuyOrderId;
        }

        const validatedSellOrderId = OrderIdValue.from(sellOrderId);
        if (validatedSellOrderId instanceof Error) {
            return validatedSellOrderId;
        }

        const validatedExecutionPrice = ExecutionPriceValue.from(executionPrice);
        if (validatedExecutionPrice instanceof Error){
            return validatedExecutionPrice;
        } 

        return new StockTransactionEntity(validatedTransactionId.value, validatedBuyOrderId.value, validatedSellOrderId.value, validatedSymbol.value, validatedQuantity.value, validatedExecutionPrice.value, validatedBuyerUserId.value, validatedSellerUserId.value, validatedByerFee.value, validatedSellerFee.value, executedAt);
    }


    private constructor(
        public id: string,
        public buyOrderId: string,
        public sellOrderId: string,
        public stockSymbol: string,
        public quantity: number,
        public executionPrice: number,
        public buyerUserId: string,
        public sellerUserId: string,
        public buyerFee: number,
        public sellerFee: number,
        public executedAt: Date
        
    ){}

    public getTotalBuyerCost(): number {
        return (this.quantity * this.executionPrice) + this.buyerFee;
    }

    public getTotalSellerRevenue(): number {
        return (this.quantity * this.executionPrice) - this.sellerFee;
    }

    public getGrossAmount(): number {
        return this.quantity * this.executionPrice;
    }

    public getTotalFeesCollected(): number {
        return this.buyerFee + this.sellerFee;
    }

    public involvesUser(userId: string): boolean {
        return this.buyerUserId === userId || this.sellerUserId === userId;
    }

    public getUserRole(userId: string): 'buyer' | 'seller' | null {
        if (this.buyerUserId === userId) return 'buyer';
        if (this.sellerUserId === userId) return 'seller';
        return null;
    }

}

