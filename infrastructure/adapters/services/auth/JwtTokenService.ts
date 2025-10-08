import jwt from 'jsonwebtoken';
import { TokenService } from "../../../../application/ports/services/auth/TokenService";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { RefreshTokenEntity } from '../../../../domain/entities/RefreshTokenEntity';
import { InvalidRefreshTokenError } from '../../../../domain/errors/InvalidRefreshTokenError';

export class JwtTokenService implements TokenService {
    private accessTokenSecret: string;
    private refreshTokenSecret: string;
    private accessTokenExpiry: number;
    private refreshTokenExpiry: number;
    
    constructor() {
        if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined in .env");
        }

        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        this.accessTokenExpiry = Number(process.env.ACCESS_TOKEN_EXPIRY ?? 3600);
        this.refreshTokenExpiry = Number(process.env.REFRESH_TOKEN_EXPIRY ?? 3600);
    }

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