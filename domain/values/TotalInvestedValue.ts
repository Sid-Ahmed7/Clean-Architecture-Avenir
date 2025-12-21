import { InvalidBalanceError } from "../errors/InvalidBalanceError";

export class TotalInvestedValue {

    public static from(amount: number) {
        if (amount < 0) {
            return new InvalidBalanceError(`Invalid total invested: ${amount}. Amount cannot be negative.`);
        }

        const decimalPlaces = (amount.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) {
            return new InvalidBalanceError(`Invalid total invested: ${amount}. Maximum 2 decimal places allowed.`);
        }

        return new TotalInvestedValue(amount);
    }

    private constructor(public value: number) {}
}
