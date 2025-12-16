import { InvalidPriceError } from "../errors/InvalidPriceError";
import { InvalidQuantityError } from "../errors/InvalidQuantityError";
import { BlockedQuantityValue } from "../values/BlockedQuantityValue";
import { QuantityValue } from "../values/QuantityValue";
import { StockSymbolValue } from "../values/StockSymbolValue";
import { UserIdValue } from "../values/UserIdValue";
import { InvalidSharesOperationError } from "../errors/InvalidSharesOperationError";
import { PositionIdValue } from "../values/PositionIdValue";
import { AveragePurchasePriceValue } from "../values/AveragePurchasePriceValue";
import { TotalInvestedValue } from "../values/TotalInvestedValue";
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
        const validatedAveragePurchasePrice = AveragePurchasePriceValue.from(averagePurchasePrice);
        if(validatedAveragePurchasePrice instanceof Error) {
            return validatedAveragePurchasePrice;
        }
        const validatedTotalInvested = TotalInvestedValue.from(totalInvested);
        if(validatedTotalInvested instanceof Error) {
            return validatedTotalInvested;
        }

        const validatedPositionId = PositionIdValue.from(id);
        if(validatedPositionId instanceof Error) {
            return validatedPositionId;
        }

        return new StockHoldingEntity(validatedPositionId.value, validatedUserId.value, validatedSymbol.value, validatedQuantity.value, validatedAveragePurchasePrice.value, validatedTotalInvested.value, createdAt, updatedAt, validatedBlockQuantity.value);
        
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
        const availableQuantity = this.quantity - (this.blockQuantity ?? 0);
        return availableQuantity >= quantity;
    }
    public blockShares(quantity: number): InvalidSharesOperationError | void {
    if (quantity <= 0) {
        return new InvalidSharesOperationError("Block quantity must be positive");
    }
    const availableQuantity = this.quantity - (this.blockQuantity ?? 0);
    if (availableQuantity < quantity) {
        return new InvalidSharesOperationError(`Insufficient available shares. Available: ${availableQuantity}, required: ${quantity}`);
    }
    if (!this.blockQuantity) {
        this.blockQuantity = 0;
    }
    this.blockQuantity += quantity;
    this.updatedAt = new Date();
}
    public unblockShares(quantity: number): InvalidQuantityError | void {
    if (quantity <= 0) {
        return new InvalidSharesOperationError("Unblock quantity must be positive");
    }
    if (!this.blockQuantity) {
        this.blockQuantity = 0;
    }
    if (this.blockQuantity < quantity) {
        return new InvalidSharesOperationError(`Cannot unblock more than blocked. Blocked: ${this.blockQuantity}, requested: ${quantity}`);
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