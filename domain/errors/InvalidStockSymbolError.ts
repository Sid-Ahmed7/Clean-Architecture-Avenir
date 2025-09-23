export class InvalidStockSymbolError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidStockSymbolError';
    }
}