import { InvalidTransactionReferenceError } from "../errors/InvalidTransactionReferenceError";

export class TransactionReferenceValue {
    private static referenceRegex =  /^[A-Z]{2,5}-\d{8}-[A-Z0-9]{1,5}$/;

    public static from(reference: string) {
    
      if(!reference || reference.trim().length === 0) {
        return new InvalidTransactionReferenceError("Transaction reference cannot be empty");
      }

      const normalizedReference = reference.trim().toUpperCase();

      if(!this.referenceRegex.test(normalizedReference)) {
        return new InvalidTransactionReferenceError(`Invalid transaction reference format: ${reference}`);
      }

        return new TransactionReferenceValue(normalizedReference);
    
    }

    private constructor(public value: string) {}
}