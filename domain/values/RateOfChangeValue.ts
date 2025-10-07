import { InvalidRateOfChangeError } from "../errors/InvalidRateOfChangeError";

export class RateOfChangeValue {
    public static from(rate: number) {

        if(rate < -100 || rate > 100) {
            return new InvalidRateOfChangeError(`Invalid rate of change: ${rate}. Rate of change must be between -100 and 100 %`);
        }
        
        return new RateOfChangeValue(rate);

    }
    private constructor(public value: number) {}
}