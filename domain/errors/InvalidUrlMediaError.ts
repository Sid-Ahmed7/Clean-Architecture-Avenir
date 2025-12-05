export class InvalidUrlMediaError extends Error {
    
    constructor(message: string) {
        super(message);
        this.name = 'InvalidUrlMediaError';
    }
}