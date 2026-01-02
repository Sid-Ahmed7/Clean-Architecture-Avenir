import { JwtTokenService } from "../services/auth/JwtTokenService";
import { RegistrationTokenService } from "../services/auth/RegistrationTokenService";
import { ResendEmailService } from "../services/ResendEmailService";
import { EmailTemplateService } from "../services/EmailTemplateService";
import { GenerateAccountNumberService } from "../services/GenerateAccountNumberService";
import { GenerateIbanService } from "../services/GenerateIbanService";
import { ManageOrderService } from "../services/news/ManageOrderService";
import { OrderBookEngineService } from "../services/order/OrderBookEngineService";
import { BankAccountService } from "../services/BankAccountService";
import { OrderValidationEngineService } from "../services/order/OrderValidationEngineService";
import { OrderMatchingEngineService } from "../services/order/OrderMatchingEngineService";
import { StockHoldingManager } from "../services/stocks/StockHoldingManager";
import { CryptoUuidGenerator } from "../services/CryptoUuidGenerator";
import { ManageTransferLimitService } from "../services/ManageTransferLimitService";
import { ValidateTransferService } from "../services/ValidateTransferService";
import { TransactionEnrichmentServiceImpl } from "../services/TransactionEnrichmentService";
import { NotificationService } from "../services/notification/NotificationService";
import { StatusMessageService } from "../services/StatusMessageService";
import { RolePriorityService } from "../services/RolePriorityService";
import { NewsService } from "../services/news/NewsService";
import { LocalFileStorageService } from "../services/news/LocalFileStorageService";
import { GenerateAltTextService } from "../services/news/GenerateAltTextService";
import { LocaleValidationService } from "../services/LocaleValidationService";
import { ManageLoanConfigService } from "../services/ManageLoanConfigService";
import { EventSubscriberService } from "../services/EventSubscriberService";

import {
  accountRepository,
  userRepository,
  contentRepository,
  mediaRepository,
  holdingRepository,
  notificationRepository,
} from "./repositories";

const baseUrl = process.env.CLIENT_BASE_URL!;

export const tokenService = new JwtTokenService();
export const emailService = new ResendEmailService();
export const registrationTokenGeneratorService = new RegistrationTokenService();
export const emailTemplateService = new EmailTemplateService(emailService, baseUrl);
export const accountNumberGenerator = new GenerateAccountNumberService(accountRepository);
export const ibanGenerator = new GenerateIbanService(accountRepository);
export const loanConfigService = new ManageLoanConfigService();
export const transferLimitService = new ManageTransferLimitService();
export const transferValidationService = new ValidateTransferService(transferLimitService);
export const transactionEnrichmentService = new TransactionEnrichmentServiceImpl(userRepository);
export const uuidService = new CryptoUuidGenerator();

export const newsService = new NewsService();
export const fileStorageService = new LocalFileStorageService();
export const orderService = new ManageOrderService(contentRepository, mediaRepository);
export const altService = new GenerateAltTextService();

export const orderBookService = new OrderBookEngineService();
export const matchingService = new OrderMatchingEngineService();
export const accountService = new BankAccountService(accountRepository);
export const holdingService = new StockHoldingManager(holdingRepository);
export const orderValidationService = new OrderValidationEngineService(accountService, holdingService);
export const localeService = new LocaleValidationService();

export const notificationService = new NotificationService();
export const statusMessageService = new StatusMessageService();
export const rolePriorityService = new RolePriorityService();

export const eventSubscriberService = new EventSubscriberService(
  accountNumberGenerator,
  ibanGenerator,
  notificationRepository,
  notificationService,
  uuidService,
  userRepository
);
