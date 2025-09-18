import { RateOfChangeValue } from "../values/RateOfChangeValue";
import { StockSymbolValue } from "../values/StockSymbolValue";

export class StockEntity {

    public static from (symbol: string, companyName: string, name: string, currentPrice: number, rateOfChange: number, isActionAvailable: boolean, previousPrice?: number) {

        const validateSymbol = StockSymbolValue.from(symbol);
        if(validateSymbol instanceof Error) {
            return validateSymbol;
        }

        const validateRateOfChange = RateOfChangeValue.from(rateOfChange);
        if(validateRateOfChange instanceof Error) {
            return validateRateOfChange;
        }

        return new StockEntity(validateSymbol.value, companyName, name, currentPrice, validateRateOfChange.value, isActionAvailable, previousPrice);

    }

    private constructor(
        public symbol: string,
        public companyName: string,
        public name: string,
        public currentPrice: number,
        public rateOfChange: number,
        public isActionAvailable: boolean,
        public previousPrice?: number,
    ) {}



}