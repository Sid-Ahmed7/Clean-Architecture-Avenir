export class PendingOverdraftRequestError extends Error {
    public constructor(message: string = "An overdraft request is already pending") {
        super(message);
        this.name = "PendingOverdraftRequestError";
    }
}

