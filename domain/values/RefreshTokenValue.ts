import { InvalidRefreshTokenError } from "../errors/InvalidRefreshTokenError";

export class RefreshTokenValue {
    public static from(token: string) {
        if(!token || token.trim().length === 0) {
            return new InvalidRefreshTokenError('Invalid refresh token');
        }
        return new RefreshTokenValue(token);
    }
    private constructor(public value: string) {}
}