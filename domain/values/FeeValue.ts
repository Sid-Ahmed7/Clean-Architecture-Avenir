import { InvalidFeeError } from "../errors/InvalidFeeError";

export class FeeValue {

    public static from(fee: number){
        if(fee < 0) {
           return new InvalidFeeError(`Invalid fee: ${fee}. Fee must be a positive number.`);
        }
        return new FeeValue(fee);
    }
    private constructor(public value: number) {}
}