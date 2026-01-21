import { InvalidMessageError } from "../errors/InvalidMessageError";

export class GroupMessageContentValue {
    public static from(content: string): GroupMessageContentValue | InvalidMessageError {
        if (!content || content.trim().length === 0) {
            return new InvalidMessageError("Message content cannot be empty");
        }

        if (content.length > 5000) {
            return new InvalidMessageError("Message content exceeds maximum length of 5000 characters");
        }

        return new GroupMessageContentValue(content);
    }

    private constructor(public readonly value: string) {}
}
