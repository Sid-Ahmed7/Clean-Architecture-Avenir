export class OrderExecutionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OrderExecutionError";
    }
}
