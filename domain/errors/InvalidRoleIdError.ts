export class InvalidRoleIdError extends Error {
    
    public id: number;
    
    constructor(id: number, message?: string) {
        super(message ?? `Invalid Role ID: "${id}"`);
        this.name = 'InvalidRoleId';
        this.id = id;
    }
}