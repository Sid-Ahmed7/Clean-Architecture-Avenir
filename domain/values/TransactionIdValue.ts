import { InvalidUserIdError } from "../errors/InvalidUserIdError";

export class TransactionIdValue {

    public static from(transactionId: string) {
        if (!transactionId || transactionId.trim() === "") {
            return new InvalidUserIdError("Transaction ID cannot be empty");
        }

        return new TransactionIdValue(transactionId);
    }

    private constructor(public value: string) {}
}
