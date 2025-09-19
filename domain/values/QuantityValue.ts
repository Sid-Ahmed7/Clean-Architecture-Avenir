import { InvalidQuantityError } from "../errors/InvalidQuantityError";

export class QuantityValue {

    public static from(quantity: number) {
        if(!Number.isInteger(quantity) || quantity <= 0) {
            return new InvalidQuantityError(`Invalid quantity: ${quantity}. Quantity must be a positive.`);
        }
        return new QuantityValue(quantity);

    }
    private constructor(public value: number) {}
}