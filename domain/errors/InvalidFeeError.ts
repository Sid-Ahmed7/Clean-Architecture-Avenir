export class InvalidFeeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidFeeError";
    }
}