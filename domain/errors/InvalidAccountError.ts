export class InvalidAccountError extends Error {
    
    constructor(message: string) {
        super(message);
        this.name = 'InvalidAccountError';
    }
}