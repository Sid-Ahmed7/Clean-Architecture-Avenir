import { RefreshTokenValue } from "../values/RefreshTokenValue";
import { UserIdValue } from "../values/UserIdValue";

export class RefreshTokenEntity {
    public static from(userId: string, token: string, expiresAt: Date, id?: number) {
        const validatedUserId = UserIdValue.from(userId);
        if(validatedUserId instanceof Error) {
            return validatedUserId;
        }
        const validatedToken = RefreshTokenValue.from(token);
        if(validatedToken instanceof Error) {
            return validatedToken;
        }
        return new RefreshTokenEntity(validatedUserId.value, validatedToken.value, expiresAt, id);
    } 
    private constructor(
        public userId: string,
        public token: string,
        public expiresAt: Date,
        public id?: number
    ) {}
}