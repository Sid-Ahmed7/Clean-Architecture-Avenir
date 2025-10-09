export class StockAlreadyExistsError extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'StockAlreadyExistsError';
    }
}
