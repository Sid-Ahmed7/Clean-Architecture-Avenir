export class InvalidInterestRateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidInterestRateError';
    }
}