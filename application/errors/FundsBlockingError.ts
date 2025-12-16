export class FundsBlockingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FundsBlockingError";
    }
}
