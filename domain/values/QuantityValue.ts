import { InvalidQuantityError } from "../errors/InvalidQuantityError";

export class QuantityValue {

    public static from(quantity: number): QuantityValue | InvalidQuantityError {
        if(!Number.isInteger(quantity) || quantity <= 0) {
            return new InvalidQuantityError(`Invalid quantity: ${quantity}. Quantity must be a positive integer.`);
        }
        return new QuantityValue(quantity);

    }
    private constructor(public readonly value: number) {}
}