import { InvalidStockSymbolError } from "../errors/InvalidStockSymbolError";

export class StockSymbolValue {

    public static from(symbol: string): StockSymbolValue | InvalidStockSymbolError {

        if(!symbol || symbol.trim().length === 0) {
            return new InvalidStockSymbolError(`Stock symbol cannot be empty: ${symbol}`);
        }

        const normalizedSymbol = symbol.trim().toUpperCase();
        
        if (normalizedSymbol.length < 1 || normalizedSymbol.length > 10 ) {
            return new InvalidStockSymbolError("Stock symbol must be between 1 and 10 characters");
        }

   
        const symbolRegex = /^[A-Z0-9]+$/;

         if(!symbolRegex.test(normalizedSymbol)) {
            return new InvalidStockSymbolError("Stock symbol can only contain letters and numbers");
        }

        return new StockSymbolValue(normalizedSymbol);
    }
    private constructor(public readonly value: string) {

}
}