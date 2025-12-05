export class MessageNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MessageNotFoundError";
    }
}