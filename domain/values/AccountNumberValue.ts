import { InvalidAccountError } from "../errors/InvalidAccountError";

export class AccountNumberValue {
    public static from(accountNumber: number) {

        if(!Number.isInteger(accountNumber) || accountNumber < 0) {
            return new InvalidAccountError(`Invalid account number: ${accountNumber}. Account number must be a positive integer`);
        }

        const accountNumberLength = accountNumber.toString().length;

        if(accountNumberLength != 11) {
            return new InvalidAccountError( `Invalid account number length: expected 11 digits, but got ${accountNumberLength}.`);
        }
        return new AccountNumberValue(accountNumber);

    }

    public static generateAccountNumber(partialAccountNumber: string = ''): AccountNumberValue | InvalidAccountError {
        if( partialAccountNumber.length === 11) {
            return AccountNumberValue.from(Number(partialAccountNumber));
        } 
        const nextDigit = partialAccountNumber.length === 0 ? Math.floor(Math.random() * 9) +1 : Math.floor(Math.floor(Math.random() * 10)); 
        return AccountNumberValue.generateAccountNumber(partialAccountNumber + nextDigit);
        
    }

    private constructor(public value: number) {}



}