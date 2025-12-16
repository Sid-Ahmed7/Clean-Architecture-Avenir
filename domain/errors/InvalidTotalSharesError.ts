export class InvalidTotalSharesError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidTotalSharesError";
    }
}
