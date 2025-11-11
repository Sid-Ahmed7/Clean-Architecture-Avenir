import {JwtTokenService} from "../services/auth/JwtTokenService";
import {PasswordEncryptionService} from "../services/auth/PasswordEncryptionService";
import {RegistrationTokenService} from "../services/auth/RegistrationTokenService";
import {ResendEmailService} from "../services/ResendEmailService";
import {EmailTemplateService} from "../services/EmailTemplateService";
import {GenerateAccountNumberService} from "../services/GenerateAccountNumberService";
import {GenerateIbanService} from "../services/GenerateIbanService";

import { InMemoryEventBus } from '../repositories/InMemoryEventBus';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { InMemoryRoleRepository } from '../repositories/InMemoryRoleRepository';
import { InMemoryConversationRepository } from '../repositories/InMemoryConversationRepository';
import { InMemoryMessageRepository } from '../repositories/InMemoryMessageRepository';
import { InMemoryUserRoleRepository } from '../repositories/InMemoryUserRoleRepository';

import { InMemoryAccountRepository } from '../repositories/InMemoryAccountRepository';
import { InMemoryNewsRepository } from '../repositories/InMemoryNewsRepository';
import { NewsService } from "../services/news/NewsService";

const baseUrl = process.env.CLIENT_BASE_URL!;
export const tokenService = new JwtTokenService();
export const passwordService = new PasswordEncryptionService();
export const emailService = new ResendEmailService();
export const registrationTokenGeneratorService = new RegistrationTokenService();
export const emailTemplateService = new EmailTemplateService(emailService, baseUrl)
export const userRepository = new InMemoryUserRepository(passwordService);
export const roleRepository = new InMemoryRoleRepository();
export const userRoleRepository = new InMemoryUserRoleRepository(roleRepository, userRepository);
export const eventBus = new InMemoryEventBus();
export const accountRepository = new InMemoryAccountRepository();
export const accountNumberGenerator = new GenerateAccountNumberService(accountRepository);
export const ibanGenerator = new GenerateIbanService(accountRepository);

export const conversationRepository = new InMemoryConversationRepository();
export const messageRepository = new InMemoryMessageRepository();


export const newsRepository = new InMemoryNewsRepository();
export const newsService = new NewsService(); 
