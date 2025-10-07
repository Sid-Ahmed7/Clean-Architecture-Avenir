import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { BankUserEntity } from "../../../domain/entities/BankUserEntity";

export interface ITokenRepository {
  generateAccessToken(userId: string, roles: RoleEnum[]): string;
  verifyRefreshToken(token: string): Promise<{ userId: string } | null>;
}

export interface IUserRoleRepository {
  findRolesByUserId(userId: string): Promise<{ id: number, name: RoleEnum }[]>;
}

export interface IUserRepository {
  findById(userId: string): Promise<BankUserEntity | null>;
}

export class RefreshTokenUseCase {
  constructor(
    private tokenRepository: ITokenRepository,
    private userRoleRepository: IUserRoleRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string; user: BankUserEntity; roles: RoleEnum[] } | Error> {
    // Verify the refresh token
    const tokenData = await this.tokenRepository.verifyRefreshToken(refreshToken);
    if (!tokenData) {
      return new Error("Invalid or expired refresh token");
    }

    // Get the user
    const user = await this.userRepository.findById(tokenData.userId);
    if (!user) {
      return new Error("User not found");
    }

    // Get user roles
    const userRoles = await this.userRoleRepository.findRolesByUserId(user.id);
    const roles = userRoles.map(role => role.name);

    // Generate a new access token
    const accessToken = this.tokenRepository.generateAccessToken(user.id, roles);

    return {
      accessToken,
      user,
      roles
    };
  }
}