export class InsufficientSharesError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InsufficientSharesError";
    }
}