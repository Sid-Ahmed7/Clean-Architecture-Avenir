import { InvalidStockSymbolError } from "../errors/InvalidStockSymbolError";

export class StockSymbolValue {

    public static from(symbol: string) {

        if(!symbol || symbol.trim().length === 0) {
            return new InvalidStockSymbolError("Stock symbol cannot be empty");
        }

        const normalizedSymbol = symbol.trim().toUpperCase();
        const parts = normalizedSymbol.split(':');
        
        if (parts.length !== 2) {
            return new InvalidStockSymbolError(
                `Invalid stock symbol format: ${normalizedSymbol}. Expected format TICKER:MARKET`
            );
        }

   
        const tickerRegex= /^[A-Z]{1,4}$/; 
        const [ticker, market] = parts;

         if(!tickerRegex.test(ticker ?? "")) {
            return new InvalidStockSymbolError(`Invalid stock symbol format: ${symbol}`);
        }

        const marketRegex = /^[A-Z]{1,6}$/
        if(!marketRegex.test(market ?? "")) {
            return new InvalidStockSymbolError(`Invalid stock symbol format: ${symbol}`);
        }

        return new StockSymbolValue(normalizedSymbol);
    }
    private constructor(public value: string) {

}
}