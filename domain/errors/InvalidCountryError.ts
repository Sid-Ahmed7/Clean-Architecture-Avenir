export class InvalidCountryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidCountryError';
    }
}
