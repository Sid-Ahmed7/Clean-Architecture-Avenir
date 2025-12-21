import { InvalidUrlMediaError } from "../errors/InvalidUrlMediaError";

export class MediaUrlValue {

    public static from (url: string): MediaUrlValue | InvalidUrlMediaError {
        if(!url || url.trim().length === 0) {
            return new InvalidUrlMediaError(`URL cannot be empty: ${url}`)
        }

        return new MediaUrlValue(url);
    }

        private constructor(public readonly value: string) {}

}