import { InvalidContentError } from "../errors/InvalidContentError";
export class ContentIdValue {

    public static from(id: string): ContentIdValue | InvalidContentError {
            if(!id || id.trim().length === 0) {

            return new InvalidContentError(`Invalid ID: ${id}`)
        }
        return new ContentIdValue(id);
    }
    private constructor(public readonly value: string) {}
}

    