import { InvalidPasswordError } from "../errors/InvalidPasswordError";

export class PasswordValue {
    public static from(password: string) {
        if(!password || password.length < 8) {
            return new InvalidPasswordError('Password must be at least 8 characters long');
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
        if(!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            return new InvalidPasswordError('Password must include uppercase, lowercase, number, and special character');
        }

        return new PasswordValue(password);

    }
    private constructor(public value: string) {}
}