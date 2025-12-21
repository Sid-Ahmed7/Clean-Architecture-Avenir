export class InvalidStreetError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidStreetError';
    }
}
