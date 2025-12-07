import { InvalidTransactionReferenceError } from "../errors/InvalidTransactionReferenceError";

export class TransactionReferenceValue {
    public static from(reference: string): TransactionReferenceValue | InvalidTransactionReferenceError {

      if(!reference || reference.trim().length === 0) {
        return new InvalidTransactionReferenceError(`Transaction reference cannot be empty: ${reference}`);
      }

      const normalizedReference = reference.trim();

        return new TransactionReferenceValue(normalizedReference);

    }

    private constructor(public readonly value: string) {}
}