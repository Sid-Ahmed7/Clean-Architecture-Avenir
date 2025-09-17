import { InvalidAccountNumberError } from "../errors/InvalidAccountNumberError";

export class AccountNumberValue {
    public static from(accountNumber: number) {

        if(!Number.isInteger(accountNumber)) {
            return new InvalidAccountNumberError(accountNumber);
        }

        if(accountNumber <= 0) {
            return new InvalidAccountNumberError(accountNumber);
        }

        const accountNumberLength = accountNumber.toString().length;

        if(accountNumberLength != 11) {
            return new InvalidAccountNumberError(accountNumber, 'Account number must be exactly 11 digits long');
        }
        return new AccountNumberValue(accountNumber);

    }
    private constructor(public value: number) {}



}