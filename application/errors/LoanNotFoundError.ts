export class LoanNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LoanNotFoundError";
    }
}