export class InvalidBlockedAmountError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidBlockedAmountError";
    }
}
