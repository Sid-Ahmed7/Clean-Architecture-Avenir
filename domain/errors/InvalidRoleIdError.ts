export class InvalidRoleIdError extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'InvalidRoleId';
    }
}