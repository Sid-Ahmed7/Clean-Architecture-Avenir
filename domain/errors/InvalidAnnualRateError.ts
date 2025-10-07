export class InvalidAnnualRateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidAnnualRateError";
    }   
}