export class InvalidOverdraftActionError extends Error {
    public constructor(message: string = "Invalid overdraft action") {
        super(message);
        this.name = "InvalidOverdraftActionError";
    }
}

