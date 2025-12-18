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
import { AccountRepositoryInterface } from '../../../application/ports/repositories/AccountRepositoryInterface';
import { TransactionRepositoryInterface } from '../../../application/ports/repositories/TransactionRepositoryInterface';
import { SavingsAccountRepositoryInterface } from '../../../application/ports/repositories/SavingsAccountRepositoryInterface';
import { SavingsProductRepositoryInterface } from '../../../application/ports/repositories/SavingsProductRepositoryInterface';
import { UserRepositoryInterface } from '../../../application/ports/repositories/auth/UserRepositoryInterface';
import { RoleRepositoryInterface } from '../../../application/ports/repositories/auth/RoleRepositoryInterface';
import { UserRoleRepositoryInterface } from '../../../application/ports/repositories/auth/UserRoleRepositoryInterface';
import { ConversationRepositoryInterface } from '../../../application/ports/repositories/chat/ConversationRepositoryInterface';
import { MessageRepositoryInterface } from '../../../application/ports/repositories/chat/MessageRepositoryInterface';
import { NewsRepositoryInterface } from '../../../application/ports/repositories/news/NewsRepositoryInterface';
import { MediaRepositoryInterface } from '../../../application/ports/repositories/news/MediaRepositoryInterface';
import { ContentRepositoryInterface } from '../../../application/ports/repositories/news/ContentRepositoryInterface';
import { StockRepositoryInterface } from '../../../application/ports/repositories/stocks/StockRepositoryInterface';
import { StockOrderRepositoryInterface } from '../../../application/ports/repositories/stocks/StockOrderRepositoryInterface';
import { StockHoldingRepositoryInterface } from '../../../application/ports/repositories/stocks/StockHoldingRepositoryInterface';
import { StockTransactionRepositoryInterface } from '../../../application/ports/repositories/stocks/StockTransactionRepositoryInterface';

import { InMemoryEventBus } from '../repositories/InMemoryEventBus';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { InMemoryRoleRepository } from '../repositories/InMemoryRoleRepository';
import { InMemoryConversationRepository } from '../repositories/InMemoryConversationRepository';
import { InMemoryMessageRepository } from '../repositories/InMemoryMessageRepository';
import { InMemoryUserRoleRepository } from '../repositories/InMemoryUserRoleRepository';
import { EventBusInterface } from '../../../application/ports/event/EventBusInterface';

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

// PostgreSQL repositories
import { PostgresEventBus } from '../repositories/postgresSQL/PostgresEventBus';
import { PostgresUserRepository } from '../repositories/postgresSQL/PostgresUserRepository';
import { PostgresRoleRepository } from '../repositories/postgresSQL/PostgresRoleRepository';
import { PostgresUserRoleRepository } from '../repositories/postgresSQL/PostgresUserRoleRepository';
import { PostgresAccountRepository } from '../repositories/postgresSQL/PostgresAccountRepository';
import { PostgresConversationRepository } from '../repositories/postgresSQL/PostgresConversationRepository';
import { PostgresMessageRepository } from '../repositories/postgresSQL/PostgresMessageRepository';
import { PostgresNewsRepository } from '../repositories/postgresSQL/PostgresNewsRepository';
import { PostgresMediaRepository } from '../repositories/postgresSQL/PostgresMediaRepository';
import { PostgresContentRepository } from '../repositories/postgresSQL/PostgresContentRepository';
import { PostgresStockRepository } from '../repositories/postgresSQL/PostgresStockRepository';
import { PostgresStockOrderRepository } from '../repositories/postgresSQL/PostgresStockOrderRepository';
import { PostgresStockHoldingRepository } from '../repositories/postgresSQL/PostgresStockHoldingRepository';
import { PostgresStockTransactionRepository } from '../repositories/postgresSQL/PostgresStockTransactionRepository';
import { PostgresTransactionRepository } from '../repositories/postgresSQL/PostgresTransactionRepository';
import { PostgresSavingsProductRepository } from '../repositories/postgresSQL/PostgresSavingsProductRepository';
import { PostgresSavingsAccountRepository } from '../repositories/postgresSQL/PostgresSavingsAccountRepository';



const baseUrl = process.env.CLIENT_BASE_URL!;
const repositoryType = process.env.REPOSITORY_TYPE || 'inmemory';

// Services (common to both repository types)
export const cryptoUuidGenerator = new CryptoUuidGenerator();
export const tokenService = new JwtTokenService();
export const passwordService = new PasswordEncryptionService();
export const emailService = new ResendEmailService();
export const registrationTokenGeneratorService = new RegistrationTokenService();
export const emailTemplateService = new EmailTemplateService(emailService, baseUrl);
export const uuidService = new CryptoUuidGenerator();
export const newsService = new NewsService();
export const fileStorageService = new LocalFileStorageService();
export const altService = new GenerateAltTextService();
export const transferLimitService = new ManageTransferLimitService();
export const orderBookService = new OrderBookEngineService();
export const matchingService = new OrderMatchingEngineService();
export const localeService = new LocaleValidationService();

export const eventBus: EventBusInterface = repositoryType === 'postgres'
  ? new PostgresEventBus()
  : new InMemoryEventBus();

export const userRepository: UserRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresUserRepository()
  : new InMemoryUserRepository(passwordService);

export const roleRepository: RoleRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresRoleRepository()
  : new InMemoryRoleRepository(cryptoUuidGenerator);

export const userRoleRepository: UserRoleRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresUserRoleRepository()
  : new InMemoryUserRoleRepository(roleRepository, userRepository);

export const accountRepository: AccountRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresAccountRepository()
  : new InMemoryAccountRepository();

export const transactionRepository: TransactionRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresTransactionRepository()
  : new InMemoryTransactionRepository();

export const conversationRepository: ConversationRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresConversationRepository()
  : new InMemoryConversationRepository();

export const messageRepository: MessageRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresMessageRepository()
  : new InMemoryMessageRepository();

export const newsRepository: NewsRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresNewsRepository()
  : new InMemoryNewsRepository();

export const mediaRepository: MediaRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresMediaRepository()
  : new InMemoryMediaRepository();

export const contentRepository: ContentRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresContentRepository()
  : new InMemoryContentRepository();

export const stockRepository: StockRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresStockRepository()
  : new InMemoryStockRepository();

export const stockOrderRepository: StockOrderRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresStockOrderRepository()
  : new InMemoryStockOrderRepository();

export const holdingRepository: StockHoldingRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresStockHoldingRepository()
  : new InMemoryStockHoldingRepository();

export const stockTransactionRepository: StockTransactionRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresStockTransactionRepository()
  : new InMemoryStockTransactionRepository();

export const savingsProductRepository: SavingsProductRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresSavingsProductRepository()
  : new InMemorySavingsProductRepository();

export const savingsAccountRepository: SavingsAccountRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresSavingsAccountRepository()
  : new InMemorySavingsAccountRepository();

// Services that depend on repositories
export const accountNumberGenerator = new GenerateAccountNumberService(accountRepository);
export const ibanGenerator = new GenerateIbanService(accountRepository);
export const transferValidationService = new ValidateTransferService(transferLimitService);
export const orderService = new ManageOrderService(contentRepository, mediaRepository);
export const accountService = new BankAccountService(accountRepository);
export const holdingService = new StockHoldingManager(holdingRepository);
export const orderValidationService = new OrderValidationEngineService(accountService, holdingService);
