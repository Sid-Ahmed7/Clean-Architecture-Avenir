import { Token } from "../../../requests/Token";


export interface RegistrationTokenGeneratorService {
    generateToken(expirationHours: number): Token;
}