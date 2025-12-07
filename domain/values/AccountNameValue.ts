import { InvalidAccountError } from "../errors/InvalidAccountError";

export class AccountNameValue {

    public static from(name: string): AccountNameValue | InvalidAccountError {

        if(typeof name !== "string") {
            return new InvalidAccountError(`Account name must be a type string: ${name}`)
        }

        if(name.trim().length < 3 || name.trim().length > 50) {
            return new InvalidAccountError(`Account Name must be between 3 and 50 characters: "${name}" (${name.trim().length} characters)`)
        }

        const regex = /^[a-zA-Z0-9 _-]+$/;

        if(!regex.test(name.trim())){
            return new InvalidAccountError(`Account name contains invalid characters: "${name}"`);
        }

        return new AccountNameValue(name.trim());

    }

        private constructor(public readonly value: string) {}

}