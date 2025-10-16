export class EmptyMessageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EmptyMessageError";
    }
}