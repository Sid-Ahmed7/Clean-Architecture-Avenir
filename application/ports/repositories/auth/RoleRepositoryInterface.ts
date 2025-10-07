import { RoleEntity } from "../../../../domain/entities/RoleEntity";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { RoleNotFoundError } from "../../../../domain/errors/RoleNotFoundError";

export interface RoleRepositoryInterface {
    findByName(name: RoleEnum): Promise<RoleEntity | RoleNotFoundError>;
    findById(id: number): Promise<RoleEntity | RoleNotFoundError>;
}