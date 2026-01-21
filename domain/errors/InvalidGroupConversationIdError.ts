export class InvalidGroupConversationIdError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidGroupConversationIdError";
    }
}