import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RoleRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { RegistrationTokenGeneratorService } from "../../ports/services/auth/RegistrationTokenGeneratorService";
import { PasswordService } from "../../ports/services/auth/PasswordService";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { LocaleService } from "../../ports/services/LocaleService";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { Register } from "../../requests/Register";
import { EmailComposerService } from "../../ports/services/EmailComposerService";

export class CreateClientAccountUseCase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly passwordService: PasswordService,
    private readonly emailComposerService: EmailComposerService,
    private readonly registrationTokenGeneratorService: RegistrationTokenGeneratorService,
    private readonly localeService: LocaleService,
    private readonly uuidService: UuidGeneratorService,
  ) {}

  public async execute(user: Register, locale?: string): Promise<BankUserEntity | Error> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser instanceof Error) {
      return existingUser;
    }

    // Valider la locale
    const validatedLocale = this.localeService.validate(locale);
    if (validatedLocale instanceof Error) {
      return validatedLocale;
    }

    // Créer l'entité utilisateur
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

    // Hasher le mot de passe
    const hashedPassword = await this.passwordService.hash(userEntity.password);
    userEntity.password = hashedPassword;
    userEntity.status = UserStatusEnum.PENDING;
    userEntity.isRegistered = false;

    // Sauvegarder l'utilisateur
    const savedUser = await this.userRepository.createUser(userEntity);
    if (savedUser instanceof Error) {
      return savedUser;
    }

    // Attribuer le rôle CLIENT
    const clientRole = await this.roleRepository.findByName(RoleEnum.CLIENT);
    if (clientRole instanceof Error) {
      return clientRole;
    }

    const userRole = await this.userRoleRepository.addRoleToUser(savedUser.id, clientRole.id);
    if (userRole instanceof Error) {
      return userRole;
    }

    // Générer le token de confirmation
    const { token, expiresAt } = this.registrationTokenGeneratorService.generateToken(24);

    savedUser.confirmationToken = token;
    savedUser.confirmationTokenExpiresAt = expiresAt;

    const updatedUser = await this.userRepository.updateUser(savedUser);
    if (updatedUser instanceof Error) {
      return updatedUser;
    }

    // Envoyer l'email de confirmation
    await this.emailComposerService.sendRegistrationConfirmation(
      updatedUser.email,
      updatedUser.firstName,
      token,
      expiresAt,
      RoleEnum.CLIENT,
      validatedLocale
    );

    return updatedUser;
  }
}
