import { InvalidAccountError } from "../errors/InvalidAccountError";

export class AccountNameValue {

    public static from(name: string){

        if(typeof name !== "string") {
            return new InvalidAccountError("Account name must be a type string")
        }

        if(name.trim().length < 3 || name.trim().length > 50) {
            return new InvalidAccountError("Account Name must be between 3 and 50 characters")
        }

        const regex = /^[a-zA-Z0-9 _-]+$/;

        if(!regex.test(name.trim())){
            return new InvalidAccountError("Account contains invalid characters");
        }

        return new AccountNameValue(name.trim());

    }

        private constructor(public value: string) {}
     
}