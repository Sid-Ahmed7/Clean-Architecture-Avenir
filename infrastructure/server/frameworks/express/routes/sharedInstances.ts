import { PasswordEncryptionService } from '../../../../adapters/services/auth/PasswordEncryptionService';
import { InMemoryUserRepository } from '../../../../adapters/repositories/InMemoryUserRepository';

const passwordService = new PasswordEncryptionService();
export const userRepository = new InMemoryUserRepository(passwordService);


