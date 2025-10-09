import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { RoleRepositoryInterface } from "../../ports/repositories/auth/RolerepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { EmailService } from "../../ports/services/EmailService";
import { RegistrationTokenGeneratorService } from "../../ports/services/auth/RegistrationTokenGeneratorService";
import { PasswordService } from "../../ports/services/auth/PasswordService";
export class RegisterUseCase {
  public constructor(
    private userRepository: UserRepositoryInterface,
    private roleRepository: RoleRepositoryInterface,
    private userRoleRepository: UserRoleRepositoryInterface,
    private passwordService: PasswordService,
    private emailService: EmailService,
    private registrationTokenGeneratorService: RegistrationTokenGeneratorService
  ) {}

  public async execute(user: BankUserEntity): Promise<BankUserEntity | Error> {

    const existingUser = await this.userRepository.findByEmail(user.email);
    
    if (existingUser instanceof Error) {
      return existingUser;
    }

    const hashedPassword = await this.passwordService.hash(user.password);
    user.password = hashedPassword;

    user.isRegistered = false;

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

    const { token, expiresAt } = this.registrationTokenGeneratorService.generateToken(24);
    
    savedUser.confirmationToken = token;
    savedUser.confirmationTokenExpiresAt = expiresAt;

    const updatedUser = await this.userRepository.updateUser(savedUser);
    
    if(updatedUser instanceof Error) {
      return updatedUser;
    }

    await this.emailService.sendEmail({
      to: updatedUser.email,
      subject: "Confirmez votre inscription à notre banque",
      text: `Bonjour ${updatedUser.firstName},\n\nVeuillez confirmer votre inscription en cliquant sur ce lien : 
      http://localhost:3000/confirm?token=${token}\n\nCe lien expirera le ${expiresAt.toISOString()}.`
    });

    return updatedUser;
  }
}