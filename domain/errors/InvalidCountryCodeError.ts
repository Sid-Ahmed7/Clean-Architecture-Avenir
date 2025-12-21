export class InvalidCountryCodeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidCountryCodeError';
    }
}
