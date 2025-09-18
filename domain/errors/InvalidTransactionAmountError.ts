export class InvalidTransactionAmountError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidTransactionAmountError";
    }
}
