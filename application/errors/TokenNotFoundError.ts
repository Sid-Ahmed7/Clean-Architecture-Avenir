export class TokenNotFoundError extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'TokenNotFoundError';
    }
}