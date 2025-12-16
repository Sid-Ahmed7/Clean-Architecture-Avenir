import {JwtTokenService} from "../services/auth/JwtTokenService";
import {PasswordEncryptionService} from "../services/auth/PasswordEncryptionService";
import {RegistrationTokenService} from "../services/auth/RegistrationTokenService";
import {ResendEmailService} from "../services/ResendEmailService";
import {EmailTemplateService} from "../services/EmailTemplateService";
import {GenerateAccountNumberService} from "../services/GenerateAccountNumberService";
import {GenerateIbanService} from "../services/GenerateIbanService";
import {ManageOrderService} from "../services/news/ManageOrderService";
import {OrderBookEngineService} from "../services/order/OrderBookEngineService";
import {BankAccountService} from "../services/BankAccountService";
import {OrderValidationEngineService} from "../services/order/OrderValidationEngineService";
import {OrderMatchingEngineService} from "../services/order/OrderMatchingEngineService";
import {StockHoldingManager} from "../services/stocks/StockHoldingManager";
import {CryptoUuidGenerator} from "../services/CryptoUuidGenerator";
import {ManageTransferLimitService} from "../services/ManageTransferLimitService";
import {ValidateTransferService} from "../services/ValidateTransferService";

import { InMemoryEventBus } from '../repositories/InMemoryEventBus';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { InMemoryRoleRepository } from '../repositories/InMemoryRoleRepository';
import { InMemoryConversationRepository } from '../repositories/InMemoryConversationRepository';
import { InMemoryMessageRepository } from '../repositories/InMemoryMessageRepository';
import { InMemoryUserRoleRepository } from '../repositories/InMemoryUserRoleRepository';

import { InMemoryAccountRepository } from '../repositories/InMemoryAccountRepository';
import { InMemoryNewsRepository } from '../repositories/InMemoryNewsRepository';
import { NewsService } from "../services/news/NewsService";
import { InMemoryMediaRepository } from "../repositories/InMemoryMediaRepository";
import { LocalFileStorageService } from "../services/news/LocalFileStorageService";
import { InMemoryContentRepository } from "../repositories/InMemoryContentRepository";
import { GenerateAltTextService } from "../services/news/GenerateAltTextService";
import { InMemoryStockRepository } from "../repositories/InMemoryStockRepository";
import { InMemoryStockOrderRepository } from "../repositories/InMemoryStockOrderRepository";
import { InMemoryStockHoldingRepository } from "../repositories/InMemoryStockHoldingRepository";
import { InMemoryStockTransactionRepository } from "../repositories/InMemoryStockTransactionRepository";
import { InMemoryTransactionRepository } from "../repositories/InMemoryTransactionRepository";
import { LocaleValidationService } from "../services/LocaleValidationService";
import { InMemorySavingsProductRepository } from '../repositories/InMemorySavingsProductRepository';
import { InMemorySavingsAccountRepository } from '../repositories/InMemorySavingsAccountRepository';

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
export const transactionRepository = new InMemoryTransactionRepository();
export const transferLimitService = new ManageTransferLimitService();
export const transferValidationService = new ValidateTransferService(transferLimitService);
export const conversationRepository = new InMemoryConversationRepository();
export const messageRepository = new InMemoryMessageRepository();
export const uuidService = new CryptoUuidGenerator()

export const newsRepository = new InMemoryNewsRepository();
export const newsService = new NewsService(); 

export const mediaRepository = new InMemoryMediaRepository();
export const fileStorageService = new LocalFileStorageService();

export const contentRepository = new InMemoryContentRepository();

export const orderService = new ManageOrderService(contentRepository, mediaRepository);
export const altService = new GenerateAltTextService();

export const stockRepository = new  InMemoryStockRepository();
export const stockOrderRepository = new InMemoryStockOrderRepository();
export const holdingRepository = new InMemoryStockHoldingRepository();
export const stockTransactionRepository = new InMemoryStockTransactionRepository();
export const orderBookService = new OrderBookEngineService();
export const matchingService = new OrderMatchingEngineService();
export const accountService = new BankAccountService(accountRepository);
export const holdingService = new StockHoldingManager(holdingRepository);
export const orderValidationService = new OrderValidationEngineService(accountService, holdingService);
export const localeService = new LocaleValidationService();

export const savingsProductRepository = new InMemorySavingsProductRepository();
export const savingsAccountRepository = new InMemorySavingsAccountRepository();
