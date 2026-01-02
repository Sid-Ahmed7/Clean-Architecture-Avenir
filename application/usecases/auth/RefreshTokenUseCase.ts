import { TokenService } from "../../ports/services/auth/TokenService";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { RefreshTokenResponse } from "../../responses/RefreshTokenResponse";


export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponse | Error> {
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
    const newRefreshToken = await this.tokenService.generateRefreshToken(user.id);

    if (newRefreshToken instanceof Error) {
      return newRefreshToken;
    }

    return {
      accessToken,
      refreshToken: newRefreshToken.token,
      user,
      roles
    };
  }
}