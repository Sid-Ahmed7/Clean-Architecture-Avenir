import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { TokenService } from "../../ports/services/auth/TokenService";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";


export class RefreshTokenUseCase {
  constructor(
    private tokenService: TokenService,
    private userRoleRepository: UserRoleRepositoryInterface,
    private userRepository: UserRepositoryInterface
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string; user: BankUserEntity; roles: RoleEnum[] } | Error> {
    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);
    if (tokenData instanceof Error) { 
      return tokenData;
    }

    const user = await this.userRepository.findById(tokenData.userId);
    if (user instanceof Error) {
      return user;
    }

    const userRoles = await this.userRoleRepository.findRolesByUserId(user.id);
    if(userRoles instanceof Error) {
      return userRoles;
    }
        
    const roles = userRoles.map(role => role.name);

    const accessToken = this.tokenService.generateAccessToken(user.id, roles);

    return {
      accessToken,
      user,
      roles
    };
  }
}