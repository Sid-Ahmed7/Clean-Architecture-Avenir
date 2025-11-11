import { InvalidNewsError } from "../errors/InvalidNewsError";


export class NewsIdValue {

    public static from(id: number) {
        if(id == null || !Number.isInteger(id) || id <= 0) {
            return new InvalidNewsError(`Invalid ID: ${id}`)
        }
        return new NewsIdValue(id);
    }
    private constructor(public value: number) {}
}

    