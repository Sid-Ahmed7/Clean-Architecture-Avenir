export class InsufficientFundsError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "InsufficientFundsError";
    }
}

