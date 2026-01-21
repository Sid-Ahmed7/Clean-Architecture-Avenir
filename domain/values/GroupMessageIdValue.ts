import { InvalidMessageError } from "../errors/InvalidMessageError";

export class GroupMessageIdValue {
    public static from(id: string): GroupMessageIdValue | InvalidMessageError {
        if (!id || id.trim().length === 0) {
            return new InvalidMessageError("Group message ID cannot be empty");
        }
        return new GroupMessageIdValue(id);
    }

    private constructor(public readonly value: string) {}
}
