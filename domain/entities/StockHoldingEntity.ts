import { InvalidPriceError } from "../errors/InvalidPriceError";
import { InvalidQuantityError } from "../errors/InvalidQuantityError";
import { BlockedQuantityValue } from "../values/BlockedQuantityValue";
import { QuantityValue } from "../values/QuantityValue";
import { StockSymbolValue } from "../values/StockSymbolValue";
import { UserIdValue } from "../values/UserIdValue";

export class StockHoldingEntity {

    public static from(id: string, userId: string, stockSymbol: string, quantity: number, averagePurchasePrice: number, totalInvested: number, createdAt: Date, updatedAt: Date, blockQuantity?: number)  {
      
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
        const validatedBlockQuantity = BlockedQuantityValue.from(blockQuantity ?? 0);
        if(validatedBlockQuantity instanceof Error) {
            return validatedBlockQuantity;
        }

        return new StockHoldingEntity(id, validatedUserId.value, validatedSymbol.value, validatedQuantity.value, averagePurchasePrice, totalInvested, createdAt, updatedAt, validatedBlockQuantity.value);
        
    }

    private constructor (
        public id: string,
        public userId: string,
        public stockSymbol: string,
        public quantity: number,
        public averagePurchasePrice: number,
        public totalInvested: number,
        public createdAt: Date,
        public updatedAt: Date,
        public blockQuantity?: number
    ){}

    public addShares(quantity: number, pricePerShare: number) : InvalidQuantityError | InvalidPriceError |void {
        if (quantity <= 0) {
        return new InvalidQuantityError("Quantity must be positive");
    }
    if (pricePerShare < 0) {
        return new InvalidPriceError("Price per share cannot be negative");
    }
        
        
        const newTotalInvested = this.totalInvested + (quantity * pricePerShare);
        const newQuantity = this.quantity + quantity;

        this.averagePurchasePrice = newTotalInvested / newQuantity;
        this.quantity = newQuantity;
        this.totalInvested = newTotalInvested;
        this.updatedAt = new Date();
    }

    public removeShares(quantity: number) : InvalidQuantityError | void {
         if(quantity <= 0) {
        return new InvalidQuantityError("Quantity must be positive");
        }
        if(quantity > this.quantity) {
            return new InvalidQuantityError("Cannot sell more shares than owned");
        }
        
        
        if(quantity > this.quantity) {
            return new InvalidQuantityError("Cannot sell more shares than owned");
        }

        this.quantity -= quantity;
        this.totalInvested = this.quantity * this.averagePurchasePrice;
        this.updatedAt = new Date();
    }

    public calculateProfitLoss(currentPrice: number): number {
        const currentValue = this.quantity * currentPrice;
        return currentValue - this.totalInvested;
    }

    public calculateProfitLossPercent(currentPrice: number): number {
    if (this.totalInvested === 0){
        return 0;
    }
        const profit = this.calculateProfitLoss(currentPrice);
        return (profit / this.totalInvested) * 100;
    }

    public calculateCurrentValue(currentPrice: number): number {
        return this.quantity * currentPrice;
    }

    public isEmpty(): boolean {
        return this.quantity === 0;
    }

    public hasEnoughShares(quantity: number): boolean {
        return this.quantity >= quantity;
    }
    public blockShares(quantity: number): void {
    if (!this.blockQuantity) {
        this.blockQuantity = 0;
    }
    this.blockQuantity += quantity;
    this.updatedAt = new Date();
}
    public unblockShares(quantity: number): void {
    if (!this.blockQuantity) {
        this.blockQuantity = 0;
    }
    this.blockQuantity -= quantity;
    this.updatedAt = new Date();
}
public getAvailableQuantity(): number {
    if(!this.blockQuantity) {
        return this.quantity;
    }
    return this.quantity - this.blockQuantity;
}

    public belongsToUser(userId: string): boolean {
        return this.userId === userId;
    }



}