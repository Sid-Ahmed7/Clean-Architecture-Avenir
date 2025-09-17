import { InvalidEmailError } from "../errors/InvalidEmailError";

export class EmailValue {
    public static from(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return new InvalidEmailError('Invalid email format');
        }
        return new EmailValue(email);
    }

    private constructor(public value: string) {}
}