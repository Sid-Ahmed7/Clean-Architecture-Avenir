export class InvalidRateOfChangeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidRateOfChangeError';
    }
}