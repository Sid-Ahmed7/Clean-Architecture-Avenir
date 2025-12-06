import { RegistrationTokenGeneratorService } from "../../../../application/ports/services/auth/RegistrationTokenGeneratorService";
import { Token } from "../../../../application/requests/Token";

export class RegistrationTokenService implements RegistrationTokenGeneratorService {
    generateToken(expirationHours: number): Token {

        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

        return { token, expiresAt}
        
    }
}