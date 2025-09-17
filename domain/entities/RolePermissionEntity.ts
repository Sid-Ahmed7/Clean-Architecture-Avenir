import { PermissionIdValue } from "../values/PermissionIdValue";
import { RoleIdValue } from "../values/RoleIdValue";
import { UserIdValue } from "../values/UserIdValue";

export class RolePermissionEntity {
    public static from(roleId: number, permissionId: number) {

        const validatedRoleId = RoleIdValue.from(roleId);
        if(validatedRoleId instanceof Error) {
            return validatedRoleId;
        }

        const validatedPermissionId = PermissionIdValue.from(permissionId);
        if(validatedPermissionId instanceof Error) {
            return validatedPermissionId;
        }


        return new RolePermissionEntity(validatedRoleId.value, validatedPermissionId.value);

    }
    private constructor(
        public roleId: number,
        public permissionId: number,
    ) {}

}