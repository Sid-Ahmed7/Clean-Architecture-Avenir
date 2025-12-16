import { InvalidPriceError } from "../errors/InvalidPriceError";

export class AveragePurchasePriceValue {

    public static from(price: number) {
        if (price < 0) {
            return new InvalidPriceError(`Invalid average purchase price: ${price}. Price cannot be negative.`);
        }

        const decimalPlaces = (price.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) {
            return new InvalidPriceError(`Invalid average purchase price: ${price}. Maximum 2 decimal places allowed.`);
        }

        return new AveragePurchasePriceValue(price);
    }

    private constructor(public value: number) {}
}
