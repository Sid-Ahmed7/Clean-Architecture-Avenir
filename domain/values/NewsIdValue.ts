import { InvalidNewsError } from "../errors/InvalidNewsError";


export class NewsIdValue {

    public static from(id: string) {
            if(!id || id.trim().length === 0) {

            return new InvalidNewsError(`Invalid ID: ${id}`)
        }
        return new NewsIdValue(id);
    }
    private constructor(public value: string) {}
}

    