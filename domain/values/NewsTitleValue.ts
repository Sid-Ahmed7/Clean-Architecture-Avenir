import { InvalidNewsError } from "../errors/InvalidNewsError";

export class NewsTitleValue {
    public static from (title: string) {
        if(!title || title.trim().length < 5) {
            return new InvalidNewsError('Title must be at least 5 characters long');
        }
        return new NewsTitleValue(title);
    }  
     private constructor(public value: string){}
} 