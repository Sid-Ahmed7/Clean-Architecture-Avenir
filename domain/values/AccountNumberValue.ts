import { InvalidAccountError } from "../errors/InvalidAccountError";

export class AccountNumberValue {
    public static from(accountNumber: number): AccountNumberValue | InvalidAccountError {

        if(!Number.isInteger(accountNumber) || accountNumber < 0) {
            return new InvalidAccountError(`Invalid account number: ${accountNumber}. Account number must be a positive integer`);
        }

        const accountNumberLength = accountNumber.toString().length;

        if(accountNumberLength != 11) {
            return new InvalidAccountError(`Invalid account number length: expected 11 digits, but got ${accountNumberLength} (${accountNumber})`);
        }
        return new AccountNumberValue(accountNumber);

    }

    private constructor(public readonly value: number) {}



}