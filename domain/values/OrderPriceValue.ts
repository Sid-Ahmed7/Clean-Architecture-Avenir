import { InvalidPriceError } from "../errors/InvalidPriceError";

export class OrderPriceValue {

    public static from(price: number) {
        if (price <= 0) {
            return new InvalidPriceError(`Invalid order price: ${price}. Price must be positive.`);
        }

        const decimalPlaces = (price.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) {
            return new InvalidPriceError(`Invalid order price: ${price}. Maximum 2 decimal places allowed.`);
        }

        return new OrderPriceValue(price);
    }

    private constructor(public value: number) {}
}
