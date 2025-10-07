export class InvalidRefreshTokenError extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'InvalidRefreshTokenError';
    }
}