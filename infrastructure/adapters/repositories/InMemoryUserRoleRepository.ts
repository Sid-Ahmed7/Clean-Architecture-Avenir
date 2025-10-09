import { UserRepositoryInterface } from "../../../application/ports/repositories/auth/UserRepositoryInterface";
import { UserRoleEntity } from "../../../domain/entities/UserRoleEntity";
import { UserNotFoundError } from "../../../application/errors/UserNotFoundError";
import { UserAlreadyExistsError } from "../../../application/errors/UserAlreadyExistsError";
import { PasswordService } from "../../../application/ports/services/auth/PasswordService";
import { UserRoleRepositoryInterface } from "../../../application/ports/repositories/auth/UserRoleRepositoryInterface";
import { RoleRepositoryInterface } from "../../../application/ports/repositories/auth/RolerepositoryInterface";
import { RoleEntity } from "../../../domain/entities/RoleEntity";
import { RoleNotFoundError } from "../../../application/errors/RoleNotFoundError";

export class InMemoryUserRoleRepository implements UserRoleRepositoryInterface {
  private userRoles: Array<UserRoleEntity>;

  public constructor(private roleRepository: RoleRepositoryInterface, private userRepository: UserRepositoryInterface) {
    this.userRoles = [];
  }

  public async findRolesByUserId(userId: string): Promise<RoleEntity[] | RoleNotFoundError> {
      const userRolesEntities = this.userRoles.filter(ur => ur.userId === userId);
        const roles: RoleEntity[] = [];

        for(const userRole of userRolesEntities) {
            const role = await this.roleRepository.findById(userRole.roleId);

            if (role instanceof RoleNotFoundError) {
                return new RoleNotFoundError(`Role with id ${userRole.roleId} not found`);
            }

            roles.push(role);
        }

        return roles;
    }

    public async addRoleToUser(userId: string, roleId: number): Promise<void | UserNotFoundError | RoleNotFoundError> {
        const user = await this.userRepository.findById(userId);
        if(user instanceof UserNotFoundError) {
            return new UserNotFoundError(`User with id ${userId} not found`);
        }

        const role = await this.roleRepository.findById(roleId);
        if(role instanceof RoleNotFoundError) {
            return new RoleNotFoundError(`Role with id ${roleId} not found`);
        }

        const userRoleExists = this.userRoles.find(ur => ur.userId === userId && ur.roleId === roleId);

        const userRoleOrError = UserRoleEntity.from(userId, roleId);

        if (userRoleOrError instanceof Error) {
        return userRoleOrError;
        }

        this.userRoles.push(userRoleOrError);

    }

}
