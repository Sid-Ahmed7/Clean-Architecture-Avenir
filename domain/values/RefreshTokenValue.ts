import { InvalidRefreshTokenError } from "../errors/InvalidRefreshTokenError";

export class RefreshTokenValue {
    public static from(token: string): RefreshTokenValue | InvalidRefreshTokenError {
        if(!token || token.trim().length === 0) {
            return new InvalidRefreshTokenError('Invalid refresh token');
        }
        return new RefreshTokenValue(token);
    }
    private constructor(public readonly value: string) {}
}