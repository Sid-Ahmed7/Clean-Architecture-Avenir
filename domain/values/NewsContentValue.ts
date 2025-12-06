import { InvalidNewsError } from "../errors/InvalidNewsError";

export class NewsContentValue {
    public static from (title: string): NewsContentValue | InvalidNewsError {
        if(!title || title.trim().length === 0) {
            return new InvalidNewsError(`Content cannot be empty: ${title}`);
        }
        return new NewsContentValue(title);

    }
     private constructor(public readonly value: string){}
} 