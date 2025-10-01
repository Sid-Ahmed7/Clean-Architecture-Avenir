export class InvalidConversationError extends Error {
    constructor(message: string)  {
        super(message);
        this.name = "InvalidConversationError";
    }
}