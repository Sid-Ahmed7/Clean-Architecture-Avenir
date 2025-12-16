export class OrderMatchingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OrderMatchingError";
    }
}