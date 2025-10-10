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
        if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_REFRESH) {
            throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined in .env");
        }

        this.accessTokenSecret = process.env.JWT_SECRET!;
        this.refreshTokenSecret = process.env.JWT_SECRET_REFRESH!;
        this.accessTokenExpiry = Number(process.env.JWT_EXPIRATION ?? 3600);
        this.refreshTokenExpiry = Number(process.env.JWT_EXPIRATION_REFRESH ?? 3600);
    }

    public generateAccessToken(userId: string, roles: RoleEnum[]): string {
        const payload = {sub: userId, roles};
        const expiredAt = Number(this.accessTokenExpiry)
        return jwt.sign(payload, this.accessTokenSecret, {expiresIn: expiredAt});
    }

    public async generateRefreshToken(userId: string): Promise<RefreshTokenEntity> {
        const payload = {sub: userId};
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