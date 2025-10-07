import { CurrencyValue } from "../values/CurrencyValue";
import { RateOfChangeValue } from "../values/RateOfChangeValue";
import { StockSymbolValue } from "../values/StockSymbolValue";

export class StockEntity {

    public static from (symbol: string, companyName: string, name: string, currentPrice: number, rateOfChange: number, currency: string, createdAt: Date, isActionAvailable: boolean, previousPrice?: number, updatedAt?: Date) {

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

        return new StockEntity(validateSymbol.value, companyName, name, currentPrice, validateRateOfChange.value, validatedCurrency.value, createdAt, isActionAvailable, previousPrice, updatedAt);

    }

    private constructor(
        public symbol: string,
        public companyName: string,
        public name: string,
        public currentPrice: number,
        public rateOfChange: number,
        public currency: string,
        public createdAt: Date,
        public isActionAvailable: boolean,
        public previousPrice?: number,
        public updatedAt?: Date,
    ) {}



}