import { InvalidNewsError } from "../errors/InvalidNewsError";

export class NewsTagValue {
        public static from (tag: string) {
            if(!tag || tag.trim().length === 0) {
                return new InvalidNewsError('Tag cannot be empty');
            }

            if(tag.length > 15) {
                return new InvalidNewsError('Tag cannot exceed 15 characters');
            }
            return new NewsTagValue(tag);
        }  
         private constructor(public value: string){}
}