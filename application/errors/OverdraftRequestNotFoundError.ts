export class OverdraftRequestNotFoundError extends Error {
    public constructor(message: string = "Overdraft request not found") {
        super(message);
        this.name = "OverdraftRequestNotFoundError";
    }
}

