export class InvalidEmailOrPasswordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidEmailOrPasswordError';
    }
}