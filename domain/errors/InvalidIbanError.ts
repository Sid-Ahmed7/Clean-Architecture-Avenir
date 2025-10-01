export class InvalidIbanError extends Error {
    
    constructor(message: string) {
        super(message);
        this.name = 'InvalidIbanError';
    }
}