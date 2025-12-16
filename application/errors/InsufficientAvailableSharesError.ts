export class InsufficientAvailableSharesError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InsufficientAvailableSharesError";
    }
}
