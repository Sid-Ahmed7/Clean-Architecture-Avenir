export class InvalidTransactionReferenceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidTransactionReferenceError';
    }
}