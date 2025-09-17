import { InvalidUserIdError } from "../errors/InvalidUserIdError";

export class UserIdValue {
    public static from(id: string) {

        if(!id || id.trim().length === 0) {
            return new InvalidUserIdError(id);
    }
        return new UserIdValue(id);

}

    private constructor(public value: string) {}
}