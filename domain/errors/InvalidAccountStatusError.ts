export class InvalidAccountStatusError extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'InvalidAccountStatusError';
    }
}