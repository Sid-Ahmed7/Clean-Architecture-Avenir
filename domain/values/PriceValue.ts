import { InvalidPriceError } from "../errors/InvalidPriceError";

export class PriceValue {

    public static from(price: number){
        if(price < 0) {
           return new InvalidPriceError(`Invalid price: ${price}. Price must be a positive number.`);
        }
        return new PriceValue(price);
    }
    private constructor(public value: number) {}
}