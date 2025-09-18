export class InvalidAccountNumberError extends Error {
    
    constructor(message: string) {
        super(message);
        this.name = 'InvalidAccountNumberError';
    }
}