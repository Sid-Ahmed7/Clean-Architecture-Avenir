import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RolerepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { PasswordService } from "../../ports/services/auth/PasswordService";
import { RegistrationTokenGeneratorService } from "../../ports/services/auth/RegistrationTokenGeneratorService";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { RegisterAdmin} from "../../requests/RegisterAdmin";

export class CreateAdminUseCase {
    public constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly roleRepository: RoleRepositoryInterface,
        private readonly userRoleRepository: UserRoleRepositoryInterface,
        private readonly passwordService: PasswordService,
        private readonly uuidService: UuidGeneratorService
    ) {}

    public async execute(user: RegisterAdmin): Promise<BankUserEntity | Error> {
        const existingUser = await this.userRepository.findByEmail(user.email);

        if (existingUser && !(existingUser instanceof Error)) {
            return new Error(`User with email ${user.email} already exists`);
        }
        
        const id = this.uuidService.generate();
        const userEntity = BankUserEntity.from(
            id,
            user.email,
            user.password,
            UserStatusEnum.PENDING,
            user.firstName,
            user.lastName,
            user.phoneNumber,
            user.dateOfBirth,
            user.address
        );

        if (userEntity instanceof Error) {
            return userEntity;
        }

        const hashedPassword = await this.passwordService.hash(userEntity.password);
        userEntity.password = hashedPassword;
        userEntity.status = UserStatusEnum.ACTIVE;
        userEntity.isRegistered = true;

        const savedUser = await this.userRepository.createUser(userEntity);

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
