import {PasswordEncryptionService} from "../services/auth/PasswordEncryptionService";
import {CryptoUuidGenerator} from "../services/CryptoUuidGenerator";
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
import { InMemoryMediaRepository } from "../repositories/InMemoryMediaRepository";
import { InMemoryContentRepository } from "../repositories/InMemoryContentRepository";
import { InMemoryStockRepository } from "../repositories/InMemoryStockRepository";
import { InMemoryStockOrderRepository } from "../repositories/InMemoryStockOrderRepository";
import { InMemoryStockHoldingRepository } from "../repositories/InMemoryStockHoldingRepository";
import { InMemoryStockTransactionRepository } from "../repositories/InMemoryStockTransactionRepository";
import { InMemoryTransactionRepository } from "../repositories/InMemoryTransactionRepository";
import { InMemorySavingsProductRepository } from '../repositories/InMemorySavingsProductRepository';
import { InMemorySavingsAccountRepository } from '../repositories/InMemorySavingsAccountRepository';

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


import { BeneficiaryRepositoryInterface } from '../../../application/ports/repositories/beneficiaries/BeneficiaryRepositoryInterface';
import { BeneficiaryGroupRepositoryInterface } from '../../../application/ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface';
import { NotificationRepositoryInterface } from '../../../application/ports/repositories/notification/NotificationRepositoryInterface';
import { LoanRequestRepositoryInterface } from '../../../application/ports/repositories/LoanRequestRepositoryInterface';
import { LoanRepaymentScheduleRepositoryInterface } from '../../../application/ports/repositories/LoanRepaymentScheduleRepositoryInterface';
import { OverdraftRequestRepositoryInterface } from '../../../application/ports/repositories/OverdraftRequestRepositoryInterface';

import { InMemoryBeneficiaryRepository } from '../repositories/InMemoryBeneficiaryRepository';
import { InMemoryBeneficiaryGroupRepository } from '../repositories/InMemoryBeneficiaryGroupRepository';
import { InMemoryNotificationRepository } from '../repositories/InMemoryNotificationRepository';

import { PostgresBeneficiaryRepository } from '../repositories/postgresSQL/PostgresBeneficiaryRepository';
import { PostgresBeneficiaryGroupRepository } from '../repositories/postgresSQL/PostgresBeneficiaryGroupRepository';
import { PostgresNotificationRepository } from '../repositories/postgresSQL/PostgresNotificationRepository';
import { PostgresLoanRequestRepository } from '../repositories/postgresSQL/PostgresLoanRequestRepository';
import { PostgresLoanRepaymentScheduleRepository } from '../repositories/postgresSQL/PostgresLoanRepaymentScheduleRepository';
import { PostgresOverdraftRequestRepository } from '../repositories/postgresSQL/PostgresOverdraftRequestRepository';
import { InMemoryLoanRequestRepository } from "../repositories/InMemoryLoanRequestRepository";
import { InMemoryLoanRepaymentScheduleRepository } from './../repositories/InMemoryLoanRepaymentScheduleRepository';
import { InMemoryOverdraftRequestRepository } from "../repositories/InMemoryOverdraftRequestRepository";
import { GroupConversationRepositoryInterface } from "../../../application/ports/repositories/group-chat/GroupConversationRepositoryInterface";
import { PostgresGroupConversationRepository } from './../repositories/postgresSQL/PostgresGroupConversationRepository';
import { InMemoryGroupConversationRepository } from './../repositories/InMemoryGroupConversation';
import { GroupParticipantRepositoryInterface } from "../../../application/ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { PostgresGroupParticipantRepository } from './../repositories/postgresSQL/PostgresGroupParticipantRepository';
import { InMemoryGroupParticipantRepository } from './../repositories/InMemoryGroupParticipant';
import { GroupMessageRepositoryInterface } from "../../../application/ports/repositories/group-chat/GroupMessageRepositoryInterface";
import { PostgresGroupMessageRepository } from './../repositories/postgresSQL/PostgresGroupMessageRepository';
import { InMemoryGroupMessageRepository } from './../repositories/InMemoryGroupMessage';

const repositoryType = process.env.REPOSITORY_TYPE || 'inmemory';

export const cryptoUuidGenerator = new CryptoUuidGenerator();
export const passwordService = new PasswordEncryptionService();



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


export const beneficiaryRepository: BeneficiaryRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresBeneficiaryRepository()
  : new InMemoryBeneficiaryRepository();

export const beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresBeneficiaryGroupRepository()
  : new InMemoryBeneficiaryGroupRepository();

export const notificationRepository: NotificationRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresNotificationRepository()
  : new InMemoryNotificationRepository();

export const loanRequestRepository: LoanRequestRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresLoanRequestRepository()
  : new InMemoryLoanRequestRepository();

export const loanRepaymentScheduleRepository: LoanRepaymentScheduleRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresLoanRepaymentScheduleRepository()
  : new InMemoryLoanRepaymentScheduleRepository();

export const overdraftRequestRepository: OverdraftRequestRepositoryInterface = repositoryType === 'postgres'
  ? new PostgresOverdraftRequestRepository()
  : new InMemoryOverdraftRequestRepository();

  export const groupConversationRepository: GroupConversationRepositoryInterface = repositoryType === 'postgres' ? new PostgresGroupConversationRepository() : new InMemoryGroupConversationRepository();
  export const groupParticipantRepository: GroupParticipantRepositoryInterface = repositoryType === 'postgres' ? new PostgresGroupParticipantRepository() : new InMemoryGroupParticipantRepository();
  export const groupMessageRepository: GroupMessageRepositoryInterface = repositoryType === 'postgres' ? new PostgresGroupMessageRepository() : new InMemoryGroupMessageRepository(); 
