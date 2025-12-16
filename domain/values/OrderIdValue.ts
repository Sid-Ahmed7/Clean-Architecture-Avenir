import { InvalidUserIdError } from "../errors/InvalidUserIdError";

export class OrderIdValue {

    public static from(orderId: string) {
        if (!orderId || orderId.trim() === "") {
            return new InvalidUserIdError("Order ID cannot be empty");
        }
        
        return new OrderIdValue(orderId);
    }

    private constructor(public value: string) {}
}
