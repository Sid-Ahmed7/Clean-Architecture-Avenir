import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UserRoleEntity } from "../../../domain/entities/UserRoleEntity";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RolerepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";

export class RegisterUseCase {
  public constructor(
    private userRepository: UserRepositoryInterface,
    private roleRepository: RoleRepositoryInterface,
    private userRoleRepository: UserRoleRepositoryInterface
  ) {}

  public async execute(user: BankUserEntity): Promise<BankUserEntity | Error> {

    const existingUser = await this.userRepository.findByEmail(user.email);
    
    if (existingUser instanceof Error) {
      return existingUser;
    }

    user.isRegistered = true;

    const savedUser = await this.userRepository.createUser(user);

    if(savedUser instanceof Error) {
      return savedUser;
    }
    
    const clientRole = await this.roleRepository.findByName(RoleEnum.CLIENT);
    
    if (clientRole instanceof Error) {
      return clientRole;
    }

    const userRole = await this.userRoleRepository.addRoleToUser(savedUser.id, clientRole.id);

    if (userRole instanceof Error) {
      return userRole;
    }

    return savedUser;
  }
}