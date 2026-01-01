import {JwtTokenService} from "../services/auth/JwtTokenService.js";
import {PasswordEncryptionService} from "../services/auth/PasswordEncryptionService.js";
import {RegistrationTokenService} from "../services/auth/RegistrationTokenService.js";
import {ResendEmailService} from "../services/ResendEmailService.js";
import {EmailTemplateService} from "../services/EmailTemplateService.js";
import {GenerateAccountNumberService} from "../services/GenerateAccountNumberService.js";
import {GenerateIbanService} from "../services/GenerateIbanService.js";
import {ManageOrderService} from "../services/news/ManageOrderService.js";
import {OrderBookEngineService} from "../services/order/OrderBookEngineService.js";
import {BankAccountService} from "../services/BankAccountService.js";
import {OrderValidationEngineService} from "../services/order/OrderValidationEngineService.js";
import {OrderMatchingEngineService} from "../services/order/OrderMatchingEngineService.js";
import {StockHoldingManager} from "../services/stocks/StockHoldingManager.js";
import {CryptoUuidGenerator} from "../services/CryptoUuidGenerator.js";
import {ManageTransferLimitService} from "../services/ManageTransferLimitService.js";
import {ValidateTransferService} from "../services/ValidateTransferService.js";
import {TransactionEnrichmentServiceImpl} from "../services/TransactionEnrichmentService.js";
import {NotificationService} from "../services/notification/NotificationService.js";
import {StatusMessageService} from "../services/StatusMessageService.js";
import {RolePriorityService} from "../services/RolePriorityService.js";

import { InMemoryEventBus } from '../repositories/InMemoryEventBus.js';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository.js';
import { InMemoryRoleRepository } from '../repositories/InMemoryRoleRepository.js';
import { InMemoryConversationRepository } from '../repositories/InMemoryConversationRepository.js';
import { InMemoryMessageRepository } from '../repositories/InMemoryMessageRepository.js';
import { InMemoryUserRoleRepository } from '../repositories/InMemoryUserRoleRepository.js';

import { InMemoryAccountRepository } from '../repositories/InMemoryAccountRepository.js';
import { InMemoryNewsRepository } from '../repositories/InMemoryNewsRepository.js';
import { NewsService } from "../services/news/NewsService.js";
import { InMemoryMediaRepository } from "../repositories/InMemoryMediaRepository.js";
import { LocalFileStorageService } from "../services/news/LocalFileStorageService.js";
import { InMemoryContentRepository } from "../repositories/InMemoryContentRepository.js";
import { GenerateAltTextService } from "../services/news/GenerateAltTextService.js";
import { InMemoryStockRepository } from "../repositories/InMemoryStockRepository.js";
import { InMemoryStockOrderRepository } from "../repositories/InMemoryStockOrderRepository.js";
import { InMemoryStockHoldingRepository } from "../repositories/InMemoryStockHoldingRepository.js";
import { InMemoryStockTransactionRepository } from "../repositories/InMemoryStockTransactionRepository.js";
import { InMemoryTransactionRepository } from "../repositories/InMemoryTransactionRepository.js";
import { InMemoryLoanRepaymentScheduleRepository } from "../repositories/InMemoryLoanRepaymentScheduleRepository.js";
import { InMemoryLoanRequestRepository } from "../repositories/InMemoryLoanRequestRepository.js";
import { InMemoryOverdraftRequestRepository } from "../repositories/InMemoryOverdraftRequestRepository.js";
import { LocaleValidationService } from "../services/LocaleValidationService.js";
import { InMemorySavingsProductRepository } from '../repositories/InMemorySavingsProductRepository.js';
import { InMemorySavingsAccountRepository } from '../repositories/InMemorySavingsAccountRepository.js';
import { ManageLoanConfigService } from "../services/ManageLoanConfigService.js";
import { InMemoryBeneficiaryRepository } from '../repositories/InMemoryBeneficiaryRepository.js';
import { InMemoryBeneficiaryGroupRepository } from '../repositories/InMemoryBeneficiaryGroupRepository.js';
import { InMemoryNotificationRepository } from '../repositories/InMemoryNotificationRepository.js';

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
export const loanRepaymentScheduleRepository = new InMemoryLoanRepaymentScheduleRepository();
export const loanRequestRepository = new InMemoryLoanRequestRepository();
export const overdraftRequestRepository = new InMemoryOverdraftRequestRepository();
export const loanConfigService = new ManageLoanConfigService();
export const transferLimitService = new ManageTransferLimitService();
export const transferValidationService = new ValidateTransferService(transferLimitService);
export const transactionEnrichmentService = new TransactionEnrichmentServiceImpl(userRepository);
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

export const beneficiaryRepository = new InMemoryBeneficiaryRepository();
export const beneficiaryGroupRepository = new InMemoryBeneficiaryGroupRepository();

export const notificationRepository = new InMemoryNotificationRepository();
export const notificationService = new NotificationService();

export const statusMessageService = new StatusMessageService();
export const rolePriorityService = new RolePriorityService();
