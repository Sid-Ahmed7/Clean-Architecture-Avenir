import { InvalidUserIdError } from "../errors/InvalidUserIdError";

export class StockIdValue {

    public static from(stockId: string) {
        if (!stockId || stockId.trim() === "") {
            return new InvalidUserIdError("Stock ID cannot be empty");
        }

        return new StockIdValue(stockId);
    }

    private constructor(public value: string) {}
}
