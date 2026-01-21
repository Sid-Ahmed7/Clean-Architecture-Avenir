export class GroupConversationNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GroupConversationNotFoundError";
    }
}
