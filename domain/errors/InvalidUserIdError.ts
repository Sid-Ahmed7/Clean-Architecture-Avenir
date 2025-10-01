export class InvalidUserIdError extends Error {
    
    constructor(message: string) {
        super(message);
        this.name = 'InvalidUserId';
    }
}