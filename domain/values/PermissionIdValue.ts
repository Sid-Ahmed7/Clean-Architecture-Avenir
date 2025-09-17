import { InvalidPermissionIdError } from "../errors/InvalidPermissionIdError";

export class PermissionIdValue {
    public static from(id: number) {

        if(id < 0) {
            return new InvalidPermissionIdError(id);
    }
        return new PermissionIdValue(id);

}

    private constructor(public value: number) {}
}