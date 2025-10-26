export class UnauthorizedMessageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedMessageError";
    }
}