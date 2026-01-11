export class UserAlreadyBanError extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'UserAlreadyBanError';
    }
}
