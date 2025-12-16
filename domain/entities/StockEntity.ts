import { CurrencyValue } from "../values/CurrencyValue";
import { RateOfChangeValue } from "../values/RateOfChangeValue";
import { StockSymbolValue } from "../values/StockSymbolValue";
import {PriceValue} from "../values/PriceValue";
import {StockIdValue} from "../values/StockIdValue";
import { TotalSharesValue } from "../values/TotalSharesValue";
import { AvailableSharesValue } from "../values/AvailableSharesValue";
import { InvalidPriceError } from "../errors/InvalidPriceError";
import { IPOTypeEnum } from "../enums/IPOTypeEnum";
import { InvalidIPOOperationError } from "../errors/InvalidIPOOperationError";
export class StockEntity {

    public static from (id:string, symbol: string, companyName: string, name: string, currentPrice: number, rateOfChange: number, currency: string, createdAt: Date, isActionAvailable: boolean, updatedAt: Date, totalShares: number, previousPrice?: number, ipoActive?: boolean, availableSharesForIPO?: number, ipoType?: IPOTypeEnum) {

        const validateSymbol = StockSymbolValue.from(symbol);
        if(validateSymbol instanceof Error) {
            return validateSymbol;
        }

        const validateRateOfChange = RateOfChangeValue.from(rateOfChange);
        if(validateRateOfChange instanceof Error) {
            return validateRateOfChange;
        }

        const validatedCurrency = CurrencyValue.from(currency);
        if(validatedCurrency instanceof Error) {
            return validatedCurrency;
        }

        const validatedPrice = PriceValue.from(currentPrice);
        if(validatedPrice instanceof Error) {
            return validatedPrice;
        }
        const validatedId = StockIdValue.from(id);
        if(validatedId instanceof Error) {
            return validatedId;
        }
        const validatedTotalShares = TotalSharesValue.from(totalShares);
        if(validatedTotalShares instanceof Error) {
            return validatedTotalShares;
        }

        const validatedAvailableSharesForIPO = AvailableSharesValue.from(availableSharesForIPO ?? 0);
        if(validatedAvailableSharesForIPO instanceof Error) {
            return validatedAvailableSharesForIPO;
        }

      
        return new StockEntity(validatedId.value,validateSymbol.value, companyName, name, validatedPrice.value, validateRateOfChange.value, validatedCurrency.value, createdAt, isActionAvailable, updatedAt, validatedTotalShares.value, previousPrice, ipoActive ?? false, validatedAvailableSharesForIPO.value, ipoType);

    }

    private constructor(
        public id: string,
        public symbol: string,
        public companyName: string,
        public name: string,
        public currentPrice: number,
        public rateOfChange: number,
        public currency: string,
        public createdAt: Date,
        public isActionAvailable: boolean,
        public updatedAt: Date,
        public totalShares: number,
        public previousPrice?: number,
        public ipoActive: boolean = false,
        public availableSharesForIPO: number = 0,
        public ipoType?: IPOTypeEnum
    ) {}

    public makeActionAvailable(): void {
        this.isActionAvailable = true;
        this.updatedAt = new Date();
    }

    public makeActionUnavailable(): void {
        this.isActionAvailable = false;
        this.updatedAt = new Date();
    }

    public updatePrice(newPrice: number) : InvalidPriceError | void {
        const validatedPrice = PriceValue.from(newPrice);
        if(validatedPrice instanceof Error) {
            return validatedPrice;
        }

        this.previousPrice = this.currentPrice;
        this.currentPrice = newPrice;

        if (this.previousPrice && this.previousPrice > 0) {
            this.rateOfChange = ((newPrice - this.previousPrice) / this.previousPrice) * 100;
        }

        this.updatedAt = new Date();
    }

    public canBeTraded(): boolean {
        return this.isActionAvailable
    }

    public isIPOActive(): boolean {
        return this.ipoActive && this.availableSharesForIPO > 0;
    }

    public closeIPO(): void {
        this.ipoActive = false;
        this.updatedAt = new Date();
    }

    public openIPO(): void {
        this.ipoActive = true;
        this.updatedAt = new Date();
    }

    public purchaseIPOShares(quantity: number): Error | void {
        if (!this.ipoActive) {
            return new InvalidIPOOperationError("IPO is not active");
        }

        if (quantity <= 0) {
            return new InvalidIPOOperationError("Quantity must be positive");
        }

        if (quantity > this.availableSharesForIPO) {
            return new InvalidIPOOperationError(`Only ${this.availableSharesForIPO} shares available for IPO`);
        }

        this.availableSharesForIPO -= quantity;
        this.updatedAt = new Date();

        if (this.availableSharesForIPO === 0) {
            this.closeIPO();
        }
    }

    public getAvailableIPOShares(): number {
        return this.ipoActive ? this.availableSharesForIPO : 0;
    }
}