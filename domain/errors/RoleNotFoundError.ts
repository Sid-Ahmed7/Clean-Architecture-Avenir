export class RoleNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RoleNotFoundError';
    }
}