import { InvalidGroupConversationIdError } from "../errors/InvalidGroupConversationIdError";

export class GroupConversationIdValue {
    public static from(id: string): GroupConversationIdValue | InvalidGroupConversationIdError {
        if (!id || id.trim().length === 0) {
            return new InvalidGroupConversationIdError("Group conversation ID cannot be empty");
        }
        return new GroupConversationIdValue(id);
    }

    private constructor(public readonly value: string) {}
}
