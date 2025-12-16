export class InvalidIPOOperationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidIPOOperationError";
    }
}
