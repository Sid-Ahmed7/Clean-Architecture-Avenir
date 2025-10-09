import { RoleEntity } from "../../../../domain/entities/RoleEntity";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { RoleNotFoundError } from "../../../errors/RoleNotFoundError";

export interface RoleRepositoryInterface {
    findByName(name: RoleEnum): Promise<RoleEntity | RoleNotFoundError>;
    findById(id: number): Promise<RoleEntity | RoleNotFoundError>;
}