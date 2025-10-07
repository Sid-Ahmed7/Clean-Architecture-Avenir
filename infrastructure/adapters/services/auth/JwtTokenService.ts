import jwt from 'jsonwebtoken';
import { TokenService } from "../../../../application/ports/services/auth/TokenService";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { RefreshTokenEntity } from '../../../../domain/entities/RefreshTokenEntity';
import { InvalidRefreshTokenError } from '../../../../domain/errors/InvalidRefreshTokenError';

export class JwtTokenService implements TokenService {

    private accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? "";
    private refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? "";
    private accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY  ?? ""
    private refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY ?? ""

    public generateAccessToken(userId: string, roles: RoleEnum[]): string {
        const payload = {userId, roles};
        const expiredAt = Number(this.accessTokenExpiry)
        return jwt.sign(payload, this.accessTokenSecret, {expiresIn: expiredAt});
    }

    public async generateRefreshToken(userId: string): Promise<RefreshTokenEntity> {
        const payload = {userId};
        const expiredAt = Number(this.refreshTokenExpiry);
        const token = jwt.sign(payload, this.refreshTokenSecret, {expiresIn: expiredAt});

        return new RefreshTokenEntity(userId, token, expiredAt);
    }
public async verifyRefreshToken(refreshToken: string): Promise<RefreshTokenEntity | InvalidRefreshTokenError> {
    const decoded = jwt.decode(refreshToken) as { userId: string; exp: number } | null;

    if (!decoded  || decoded.exp * 1000 < Date.now()) {
        return new InvalidRefreshTokenError('Refresh token is invalid or expired');
    }

    return new RefreshTokenEntity(decoded.userId, refreshToken, decoded.exp);
}


}