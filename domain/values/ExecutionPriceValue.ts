import { InvalidPriceError } from "../errors/InvalidPriceError";

export class ExecutionPriceValue {

    public static from(price: number) {
        if (price <= 0) {
            return new InvalidPriceError(`Invalid execution price: ${price}. Price must be positive.`);
        }

        const decimalPlaces = (price.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) {
            return new InvalidPriceError(`Invalid execution price: ${price}. Maximum 2 decimal places allowed.`);
        }

        return new ExecutionPriceValue(price);
    }

    private constructor(public value: number) {}
}
