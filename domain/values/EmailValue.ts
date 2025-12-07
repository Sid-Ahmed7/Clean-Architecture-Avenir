import { InvalidEmailError } from "../errors/InvalidEmailError";

export class EmailValue {
    public static from(email: string): EmailValue | InvalidEmailError {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return new InvalidEmailError(`Invalid email format: ${email}`);
        }
        return new EmailValue(email);
    }

    private constructor(public readonly value: string) {}
}