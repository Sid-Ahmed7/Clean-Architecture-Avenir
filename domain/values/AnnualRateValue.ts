import { InvalidAnnualRateError } from "../errors/InvalidAnnualRateError";

export class AnnualRateValue {
    public static from(annualRate: number) {
        if (isNaN(annualRate) || annualRate < 0 || annualRate > 100) {
            return new InvalidAnnualRateError(`Invalid annual rate: ${annualRate}. It must be between 0 and 100.`);
        }
        
    }
    private constructor(public value: number) {}
}
    