import { PasswordService } from "../../../../application/ports/services/auth/PasswordService";
import bcrypt from 'bcrypt';

export class PasswordEncryptionService implements PasswordService {

    private readonly SALT_ROUNDS = 10;

    public async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    public async verify(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
    
}