import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RefreshTokenEntity } from "../../../domain/entities/RefreshTokenEntity";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { TokenService } from "../../ports/services/auth/TokenService";
import { PasswordService } from "../../ports/services/auth/PasswordService";
import { InvalidEmailOrPasswordError } from "../../../domain/errors/InvalidEmailOrPasswordError";


export class LoginUseCase {
  constructor(
    private userRepository: UserRepositoryInterface,
    private userRoleRepository: UserRoleRepositoryInterface,
    private tokenService: TokenService,
    private passwordService: PasswordService
  ) {}

  public async execute(email: string,password: string): Promise<{ accessToken: string; refreshToken: string; user: BankUserEntity; roles: RoleEnum[] } | Error> {

    const user = await this.userRepository.findByEmail(email);
    if(user instanceof Error) {
      return user;
    }

    if (user.status !== UserStatusEnum.ACTIVE) {
      return new Error("User account is not active");
    }

    const isPasswordValid = await this.passwordService.verify(password, user.password);
    if (!isPasswordValid) {
      return new InvalidEmailOrPasswordError("Invalid email or password");
    }

    const userRoles = await this.userRoleRepository.findRolesByUserId(user.id);
    if(userRoles instanceof Error) {
      return userRoles;
    }
    
    const roles = userRoles.map(role => role.name);

    const accessToken = this.tokenService.generateAccessToken(user.id, roles);
    const refreshTokenEntity = await this.tokenService.generateRefreshToken(user.id);

    return {
      accessToken: accessToken,
      refreshToken: refreshTokenEntity.token,
      user,
      roles
    };
  }
}