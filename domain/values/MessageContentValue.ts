import { InvalidMessageError } from "../errors/InvalidMessageError";

export class MessageContentValue {
    public static from (content: string) {
        if(!content || content.trim().length === 0) {
            return new InvalidMessageError("Message cannot be empty")
        }

        return new MessageContentValue(content);
    }

        private constructor(public value: string) {}

}