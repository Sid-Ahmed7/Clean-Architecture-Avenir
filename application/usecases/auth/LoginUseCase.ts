import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { UserStatusEnum } from "../../../domain/enums/UserStatusEnum";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { RefreshTokenEntity } from "../../../domain/entities/RefreshTokenEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<BankUserEntity | null>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export interface IUserRoleRepository {
  findRolesByUserId(userId: string): Promise<{ id: number, name: RoleEnum }[]>;
}

export interface ITokenRepository {
  generateAccessToken(userId: string, roles: RoleEnum[]): string;
  generateRefreshToken(userId: string): Promise<RefreshTokenEntity>;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private userRoleRepository: IUserRoleRepository,
    private tokenRepository: ITokenRepository
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: BankUserEntity; roles: RoleEnum[] } | Error> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return new Error("Invalid email or password");
    }

    // Check if user is active
    if (user['status'] !== UserStatusEnum.ACTIVE) {
      return new Error("User account is not active");
    }

    // Verify password
    const isPasswordValid = await this.userRepository.verifyPassword(password, user['password']);
    if (!isPasswordValid) {
      return new Error("Invalid email or password");
    }

    // Get user roles
    const userRoles = await this.userRoleRepository.findRolesByUserId(user.id);
    const roles = userRoles.map(role => role.name);

    // Generate tokens
    const accessToken = this.tokenRepository.generateAccessToken(user.id, roles);
    const refreshTokenEntity = await this.tokenRepository.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken: refreshTokenEntity.token,
      user,
      roles
    };
  }
}