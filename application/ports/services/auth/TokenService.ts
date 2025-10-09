import { RefreshTokenEntity } from "../../../../domain/entities/RefreshTokenEntity";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { InvalidTokenError } from "../../../../domain/errors/InvalidTokenError";

export interface TokenService {
    generateAccessToken(userId: string, roles: RoleEnum[]): string;
    generateRefreshToken(userId: string): Promise<RefreshTokenEntity>;
    verifyRefreshToken(refreshToken: string): Promise<RefreshTokenEntity | InvalidTokenError>;
}