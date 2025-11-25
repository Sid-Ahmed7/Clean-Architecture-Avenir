export class InvalidNewsError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'InvalidNewsError';
    }
}