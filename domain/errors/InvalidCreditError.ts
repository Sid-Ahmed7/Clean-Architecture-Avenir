export class InvalidCreditError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidCreditError";
    }
}