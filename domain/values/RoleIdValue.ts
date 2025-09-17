import { InvalidRoleIdError } from "../errors/InvalidRoleIdError";

export class RoleIdValue {
    public static from(id: number) {

        if(id < 0) {
            return new InvalidRoleIdError(id);
    }
        return new RoleIdValue(id);

}

    private constructor(public value: number) {}
}