import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RefreshTokenEntity } from "../../../domain/entities/RefreshTokenEntity";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { TokenService } from "../../ports/services/auth/TokenService";
import { PasswordService } from "../../ports/services/auth/PasswordService";
import { InvalidEmailOrPasswordError } from "../../errors/InvalidEmailOrPasswordError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { LoginResponse } from "../../responses/LoginResponse";


 export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService
  ) {}

  public async execute(email: string,password: string): Promise<LoginResponse | Error> {

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return new InvalidEmailOrPasswordError("Invalid email or password");
    }

    if (user.status !== UserStatusEnum.ACTIVE) {
      return new InvalidAccountError("User account is not active");
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