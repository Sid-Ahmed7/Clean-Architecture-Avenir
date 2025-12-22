export class InvalidTransferLimitError extends Error {
    public constructor(message: string = "Invalid transfer limit") {
        super(message);
        this.name = "InvalidTransferLimitError";
    }
}

