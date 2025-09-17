export class InvalidPermissionIdError extends Error {
    
    public id: number;
    
    constructor(id: number, message?: string) {
        super(message ?? `Invalid Permission ID: "${id}"`);
        this.name = 'InvalidPermissionId';
        this.id = id;
    }
}