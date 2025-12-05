import { InvalidUrlMediaError } from "../errors/InvalidUrlMediaError";

export class MediaUrlValue {

    public static from (url: string) {
        if(!url || url.trim().length === 0) {
            return new InvalidUrlMediaError("URL cannot be empty")
        }

        return new MediaUrlValue(url);
    }

        private constructor(public value: string) {}

}