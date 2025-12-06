export class TransferLimitExceededError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "TransferLimitExceededError";
    }
}

