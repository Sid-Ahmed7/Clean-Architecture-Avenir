export class TransferLimitIncreaseError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "TransferLimitIncreaseError";
    }
}

