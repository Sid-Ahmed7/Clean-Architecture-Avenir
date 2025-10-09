import { CurrencyValue } from "../values/CurrencyValue";
import { RateOfChangeValue } from "../values/RateOfChangeValue";
import { StockSymbolValue } from "../values/StockSymbolValue";

export class StockEntity {

    public static from (id:number, symbol: string, companyName: string, name: string, currentPrice: number, rateOfChange: number, currency: string, createdAt: Date, isActionAvailable: boolean, updatedAt: Date, previousPrice?: number) {

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

        return new StockEntity(id,validateSymbol.value, companyName, name, currentPrice, validateRateOfChange.value, validatedCurrency.value, createdAt, isActionAvailable, updatedAt, previousPrice);

    }

    private constructor(
        public id: number,
        public symbol: string,
        public companyName: string,
        public name: string,
        public currentPrice: number,
        public rateOfChange: number,
        public currency: string,
        public createdAt: Date,
        public isActionAvailable: boolean,
        public updatedAt: Date,
        public previousPrice?: number,
    ) {}

    public makeActionAvailable(): void {
        this.isActionAvailable = true;
        this.updatedAt = new Date();
    }

    public makeActionUnavailable(): void {
        this.isActionAvailable = false;
        this.updatedAt = new Date();
    }




}