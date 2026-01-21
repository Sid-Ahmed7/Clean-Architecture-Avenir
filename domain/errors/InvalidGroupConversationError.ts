export class InvalidGroupConversationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidGroupConversationError";
    }
}