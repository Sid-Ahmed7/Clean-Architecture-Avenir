import { Token } from "../../../../domain/interfaces/Token";


export interface RegistrationTokenGeneratorService {
    generateToken(expirationHours: number): Token;
}