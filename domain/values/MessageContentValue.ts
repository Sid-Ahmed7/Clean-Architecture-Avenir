import { InvalidMessageError } from "../errors/InvalidMessageError";

export class MessageContentValue {
    public static from (content: string): MessageContentValue | InvalidMessageError {
        if(!content || content.trim().length === 0) {
            return new InvalidMessageError(`Message cannot be empty: ${content}`)
        }

        return new MessageContentValue(content);
    }

        private constructor(public readonly value: string) {}

}