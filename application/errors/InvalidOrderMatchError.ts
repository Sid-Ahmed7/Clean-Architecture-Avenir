export class InvalidOrderMatchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidOrderMatchError";
    }
}
