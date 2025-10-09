import { BankUserEntity } from "../../../../domain/entities/BankUserEntity";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { RoleEntity } from "../../../../domain/entities/RoleEntity";
import { RoleNotFoundError } from "../../../errors/RoleNotFoundError";

export interface UserRoleRepositoryInterface {
    findRolesByUserId(userId: string): Promise<RoleEntity[] | RoleNotFoundError>;
    addRoleToUser(userId: string, roleId: number): Promise<void | UserNotFoundError | RoleNotFoundError>;
}