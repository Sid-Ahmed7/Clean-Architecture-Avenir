export class InvalidUserIdError extends Error {
    
    public id: string;
    
    constructor(id: string, message?: string) {
        super(message ?? `Invalid User ID: "${id}"`);
        this.name = 'InvalidUserId';
        this.id = id;
    }
}