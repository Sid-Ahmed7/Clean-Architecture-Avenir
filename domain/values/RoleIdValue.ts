import { InvalidRoleIdError } from "../errors/InvalidRoleIdError";

export class RoleIdValue {
    public static from(id: string): RoleIdValue | InvalidRoleIdError {

        if(!id || id.trim().length === 0) {
            return new InvalidRoleIdError(`Invalid role ID: ${id}`);
    }
        return new RoleIdValue(id);

}

    private constructor(public readonly value: string) {}
}