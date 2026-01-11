export class UserNoBanError extends Error {
        constructor(message: string) {
        super(message);
        this.name = 'UserNoBanError';
    }
}
