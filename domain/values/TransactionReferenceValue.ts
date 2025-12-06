import { InvalidTransactionReferenceError } from "../errors/InvalidTransactionReferenceError";

export class TransactionReferenceValue {
    public static from(reference: string) {
    
      if(!reference || reference.trim().length === 0) {
        return new InvalidTransactionReferenceError("Transaction reference cannot be empty");
      }

      const normalizedReference = reference.trim();

        return new TransactionReferenceValue(normalizedReference);
    
    }

    private constructor(public value: string) {}
}