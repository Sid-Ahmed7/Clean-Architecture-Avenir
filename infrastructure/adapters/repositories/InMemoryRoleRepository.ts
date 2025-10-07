import { RoleRepositoryInterface } from "../../../application/ports/repositories/auth/RolerepositoryInterface";
import { RoleEntity } from "../../../domain/entities/RoleEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RoleNotFoundError } from "../../../domain/errors/RoleNotFoundError";

export class InMemoryRoleRepository implements RoleRepositoryInterface {

  private roles: Array<RoleEntity>;
      public constructor() {
        this.roles = []
    }

  

  async findByName(name: RoleEnum): Promise<RoleEntity | RoleNotFoundError> {
    const role = this.roles.find(r => r.name === name);
    if(!role) {
      return new RoleNotFoundError(`Role with name ${name} not found`);
    }

    return role;
  }

    async findById(id: number): Promise<RoleEntity | RoleNotFoundError> {
    const role = this.roles.find(r => r.id === id);
    if(!role) {
      return new RoleNotFoundError(`Role with id ${id} not found`);
    }

    return role;
  }
}