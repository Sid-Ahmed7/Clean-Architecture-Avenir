import { InvalidUserIdError } from "../errors/InvalidUserIdError";

export class UserIdValue {
    public static from(id: string): UserIdValue | InvalidUserIdError {

        if(!id || id.trim().length === 0) {
            return new InvalidUserIdError(`Invalid user ID: ${id}` );
    }
        return new UserIdValue(id);

}

    private constructor(public readonly value: string) {}
}