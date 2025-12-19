export class InvalidPostalCodeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidPostalCodeError';
    }
}
