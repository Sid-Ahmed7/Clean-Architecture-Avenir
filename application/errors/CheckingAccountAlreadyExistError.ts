export class CheckingAccountAlreadyExistError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CheckingAccountAlreadyExistError';
    }
}