import { InvalidInterestRateError } from "../errors/InvalidInterestRateError";

export class InterestRateValue {
    private static MIN_RATE = 0;
    private static MAX_RATE = 100;

    public static from(rate: number): InterestRateValue | InvalidInterestRateError {
        if(rate < this.MIN_RATE || rate > this.MAX_RATE) {
            return new InvalidInterestRateError(`Invalid interest rate: ${rate}. Must be between ${this.MIN_RATE} and ${this.MAX_RATE}`);
        }
        return new InterestRateValue(rate);

    }
    private constructor(public readonly value: number) {}
}