export class InvalidCityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidCityError';
    }
}
