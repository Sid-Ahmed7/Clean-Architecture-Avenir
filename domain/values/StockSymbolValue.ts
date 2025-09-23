import { InvalidStockSymbolError } from "../errors/InvalidStockSymbolError";

export class StockSymbolValue {

    public static from(symbol: string) {

        if(!symbol || symbol.trim().length === 0) {
            return new InvalidStockSymbolError("Stock symbol cannot be empty");
        }

        const exchangeRegex = /^[A-Z]{1,6}$/
        const symbolRegex= /^[A-Z]{1,4}$/;
        
        const normalizedSymbol = symbol.trim().toUpperCase();
        const [exchange, ticker] = symbol.split(':');

        if(!exchange || !ticker) {
            return new InvalidStockSymbolError(`Invalid stock symbol format: ${symbol}`);
        }

        if(!exchangeRegex.test(exchange) || !symbolRegex.test(ticker)) {
            return new InvalidStockSymbolError(`Invalid stock symbol format: ${symbol}`);
        }

        return new StockSymbolValue(normalizedSymbol);
    }
    private constructor(public value: string) {

}
}