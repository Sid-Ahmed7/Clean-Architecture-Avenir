import { InvalidNewsError } from "../errors/InvalidNewsError";

export class NewsContentValue {
    public static from (title: string) {
        if(!title || title.trim().length === 0) {
            return new InvalidNewsError('Content cannot be empty');
        }
        return new NewsContentValue(title);

    }  
     private constructor(public value: string){}
} 