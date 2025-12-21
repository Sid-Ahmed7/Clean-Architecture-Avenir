import { InvalidNewsError } from "../errors/InvalidNewsError";

export class NewsTitleValue {
    public static from (title: string): NewsTitleValue | InvalidNewsError {
        if(!title || title.trim().length < 5) {
            return new InvalidNewsError(`Title must be at least 5 characters long: ${title} (${title?.trim().length || 0} characters)`);
        }
        return new NewsTitleValue(title);
    }
     private constructor(public readonly value: string){}
} 