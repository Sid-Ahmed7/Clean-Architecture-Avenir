export class InvalidPermissionIdError extends Error {
    
    constructor(message: string) {
        super(message);
        this.name = 'InvalidPermissionId';
    }
}