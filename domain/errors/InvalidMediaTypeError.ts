export class InvalidMediaTypeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidMediaTypeError';
    }
}
