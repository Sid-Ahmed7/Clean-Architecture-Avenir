export class StockNotAvailableError extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'StockNotAvailableError';
    }
}
