import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RolerepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { PasswordService } from "../../ports/services/auth/PasswordService";

export class CreateAdminUseCase {
    public constructor(
        private userRepository: UserRepositoryInterface,
        private roleRepository: RoleRepositoryInterface,
        private userRoleRepository: UserRoleRepositoryInterface,
        private passwordService: PasswordService
    ) {}

    public async execute(user: BankUserEntity): Promise<BankUserEntity | Error> {
        const existingUser = await this.userRepository.findByEmail(user.email);

        if (existingUser && !(existingUser instanceof Error)) {
            return new Error(`User with email ${user.email} already exists`);
        }

        const hashedPassword = await this.passwordService.hash(user.password);
        user.password = hashedPassword;
        user.status = UserStatusEnum.ACTIVE;
        user.isRegistered = true;

        const savedUser = await this.userRepository.createUser(user);

        if (savedUser instanceof Error) {
            return savedUser;
        }

        const adminRole = await this.roleRepository.findByName(RoleEnum.ADMIN);

        if (adminRole instanceof Error) {
            return adminRole;
        }

        const userRole = await this.userRoleRepository.addRoleToUser(savedUser.id, adminRole.id);

        if (userRole instanceof Error) {
            return userRole;
        }

        return savedUser;
    }
}
