import { RoleIdValue } from "../values/RoleIdValue";
import { UserIdValue } from "../values/UserIdValue";

export class UserRoleEntity {
    public static from(userId: string, roleId: string) {

        const validatedUserId = UserIdValue.from(userId);
        if(validatedUserId instanceof Error) {
            return validatedUserId;
        }

        const validatedRoleId = RoleIdValue.from(roleId);
        if(validatedRoleId instanceof Error) {
            return validatedRoleId;
        }
        return new UserRoleEntity(validatedUserId.value, validatedRoleId.value);

    }
    private constructor(
        public readonly userId: string,
        public readonly roleId: string,
    ) {}

}