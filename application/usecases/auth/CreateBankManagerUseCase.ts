import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RolerepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { EmailService } from "../../ports/services/EmailService";
import { RegistrationTokenGeneratorService } from "../../ports/services/auth/RegistrationTokenGeneratorService";
import { EmailComposerService } from "../../ports/services/EmailComposerService";
import { PasswordService } from "../../ports/services/auth/PasswordService";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { LocaleService } from "../../ports/services/LocaleService";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { RegisterBankManager} from "../../requests/RegisterBankManager";
export class CreateBankManagerUseCase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly passwordService: PasswordService,
    private readonly emailComposerService: EmailComposerService,
    private readonly registrationTokenGeneratorService: RegistrationTokenGeneratorService,
    private readonly localeService: LocaleService,
    private readonly uuidService: UuidGeneratorService
  ) {}

  public async execute(user: RegisterBankManager, locale?: string): Promise<BankUserEntity | Error> {
    const existingUser = await this.userRepository.findByEmail(user.email);

    if (existingUser instanceof Error) {
      return existingUser;
    }
     const validatedLocale = this.localeService.validate(locale);
    if (validatedLocale instanceof Error) {
        return validatedLocale;
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
    userEntity.status = UserStatusEnum.PENDING;
    userEntity.isRegistered = false;

    const savedUser = await this.userRepository.createUser(userEntity);

    if(savedUser instanceof Error) {
      return savedUser;
    }

    const bankManagerRole = await this.roleRepository.findByName(RoleEnum.BANK_MANAGER);

    if (bankManagerRole instanceof Error) {
      return bankManagerRole;
    }

    const userRole = await this.userRoleRepository.addRoleToUser(savedUser.id, bankManagerRole.id);

    if (userRole instanceof Error) {
      return userRole;
    }

    const { token, expiresAt } = this.registrationTokenGeneratorService.generateToken(24);

    savedUser.confirmationToken = token;
    savedUser.confirmationTokenExpiresAt = expiresAt;

    const updatedUser = await this.userRepository.updateUser(savedUser);

    if(updatedUser instanceof Error) {
      return updatedUser;
    }

    await this.emailComposerService.sendRegistrationConfirmation(
      updatedUser.email,
      updatedUser.firstName,
      token,
      expiresAt,
      RoleEnum.BANK_MANAGER,
      validatedLocale,
    );

    return updatedUser;
  }
}