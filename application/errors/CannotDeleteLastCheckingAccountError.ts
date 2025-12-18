export class CannotDeleteLastCheckingAccountError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CannotDeleteLastCheckingAccount";
    }
}
