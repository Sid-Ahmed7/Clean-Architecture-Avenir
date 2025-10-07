import { UserRoleEntity } from "../../../domain/entities/UserRoleEntity";
import { IUserRoleRepository as IRegisterUserRoleRepository } from "../../../application/usecases/auth/RegisterUseCase";
import { IUserRoleRepository as ILoginUserRoleRepository } from "../../../application/usecases/auth/LoginUseCase";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RoleRepository } from "./RoleRepository";

// This is a mock in-memory repository for demonstration purposes
// In a real application, this would connect to a database
export class UserRoleRepository implements IRegisterUserRoleRepository, ILoginUserRoleRepository {
  private userRoles: UserRoleEntity[] = [];
  private roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
  }

  async save(userRole: UserRoleEntity): Promise<UserRoleEntity> {
    // Check if user-role association already exists
    const existingUserRole = this.userRoles.find(
      ur => ur.userId === userRole.userId && ur.roleId === userRole.roleId
    );

    if (!existingUserRole) {
      this.userRoles.push(userRole);
    }

    return userRole;
  }

  async findRolesByUserId(userId: string): Promise<{ id: number, name: RoleEnum }[]> {
    const userRoleEntities = this.userRoles.filter(ur => ur.userId === userId);
    const roles = [];

    for (const userRole of userRoleEntities) {
      const role = await this.roleRepository.findById(userRole.roleId);
      if (role) {
        roles.push(role);
      }
    }

    return roles;
  }
}