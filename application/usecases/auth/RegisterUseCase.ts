import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UserRoleEntity } from "../../../domain/entities/UserRoleEntity";

export interface IUserRepository {
  save(user: BankUserEntity): Promise<BankUserEntity>;
  findByEmail(email: string): Promise<BankUserEntity | null>;
}

export interface IRoleRepository {
  findByName(name: RoleEnum): Promise<{ id: number, name: RoleEnum } | null>;
}

export interface IUserRoleRepository {
  save(userRole: UserRoleEntity): Promise<UserRoleEntity>;
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
    private userRoleRepository: IUserRoleRepository
  ) {}

  async execute(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber?: string,
    dateOfBirth?: Date,
    address?: string
  ): Promise<BankUserEntity | Error> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      return new Error("User with this email already exists");
    }

    // Create new user
    const userOrError = BankUserEntity.from(
      email,
      password,
      UserStatusEnum.ACTIVE,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      address,
      true // isRegistered
    );

    if (userOrError instanceof Error) {
      return userOrError;
    }

    // Save user
    const savedUser = await this.userRepository.save(userOrError);

    // Assign CLIENT role to user
    const clientRole = await this.roleRepository.findByName(RoleEnum.CLIENT);
    if (!clientRole) {
      return new Error("Client role not found");
    }

    const userRoleOrError = UserRoleEntity.from(savedUser.id, clientRole.id);
    if (userRoleOrError instanceof Error) {
      return userRoleOrError;
    }

    await this.userRoleRepository.save(userRoleOrError);

    return savedUser;
  }
}