export class InvalidOverdraftRequestError extends Error {
    public constructor(message: string = "Invalid overdraft request") {
        super(message);
        this.name = "InvalidOverdraftRequestError";
    }
}

