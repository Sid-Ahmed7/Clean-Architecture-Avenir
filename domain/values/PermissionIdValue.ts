import { InvalidPermissionIdError } from "../errors/InvalidPermissionIdError";

export class PermissionIdValue {
    public static from(id: number): PermissionIdValue | InvalidPermissionIdError {

        if(id < 0) {
            return new InvalidPermissionIdError(`Invalid permission ID: ${id}`);
    }
        return new PermissionIdValue(id);

}

    private constructor(public readonly value: number) {}
}