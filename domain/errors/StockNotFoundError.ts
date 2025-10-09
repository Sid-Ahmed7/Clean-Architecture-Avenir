export class StockNotFoundError extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'StockNotFoundError';
    }
}
