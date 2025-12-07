import { InvalidNewsError } from "../errors/InvalidNewsError";

export class NewsTagValue {
        public static from (tag: string): NewsTagValue | InvalidNewsError {
            if(!tag || tag.trim().length === 0) {
                return new InvalidNewsError(`Tag cannot be empty: ${tag}`);
            }

            if(tag.length > 15) {
                return new InvalidNewsError(`Tag cannot exceed 15 characters: ${tag} (${tag.length} characters)`);
            }
            return new NewsTagValue(tag);
        }
         private constructor(public readonly value: string){}
}