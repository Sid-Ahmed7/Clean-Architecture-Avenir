import { PasswordEncryptionService } from "../services/auth/PasswordEncryptionService";

import { InMemoryEventBus } from '../repositories/InMemoryEventBus';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { InMemoryRoleRepository } from '../repositories/InMemoryRoleRepository';
import { InMemoryConversationRepository } from '../repositories/InMemoryConversationRepository';
import { InMemoryMessageRepository } from '../repositories/InMemoryMessageRepository';
import { InMemoryUserRoleRepository } from '../repositories/InMemoryUserRoleRepository';
import { InMemoryAccountRepository } from '../repositories/InMemoryAccountRepository';
import { InMemoryNewsRepository } from '../repositories/InMemoryNewsRepository';
import { InMemoryMediaRepository } from "../repositories/InMemoryMediaRepository";
import { InMemoryContentRepository } from "../repositories/InMemoryContentRepository";
import { InMemoryStockRepository } from "../repositories/InMemoryStockRepository";
import { InMemoryStockOrderRepository } from "../repositories/InMemoryStockOrderRepository";
import { InMemoryStockHoldingRepository } from "../repositories/InMemoryStockHoldingRepository";
import { InMemoryStockTransactionRepository } from "../repositories/InMemoryStockTransactionRepository";
import { InMemoryTransactionRepository } from "../repositories/InMemoryTransactionRepository";
import { InMemoryLoanRepaymentScheduleRepository } from "../repositories/InMemoryLoanRepaymentScheduleRepository";
import { InMemoryLoanRequestRepository } from "../repositories/InMemoryLoanRequestRepository";
import { InMemoryOverdraftRequestRepository } from "../repositories/InMemoryOverdraftRequestRepository";
import { InMemorySavingsProductRepository } from '../repositories/InMemorySavingsProductRepository';
import { InMemorySavingsAccountRepository } from '../repositories/InMemorySavingsAccountRepository';
import { InMemoryBeneficiaryRepository } from '../repositories/InMemoryBeneficiaryRepository';
import { InMemoryBeneficiaryGroupRepository } from '../repositories/InMemoryBeneficiaryGroupRepository';
import { InMemoryNotificationRepository } from '../repositories/InMemoryNotificationRepository';

export const passwordService = new PasswordEncryptionService();

// Repositories
export const roleRepository = new InMemoryRoleRepository();
export const userRepository = new InMemoryUserRepository(passwordService);
export const userRoleRepository = new InMemoryUserRoleRepository(roleRepository, userRepository);
export const eventBus = new InMemoryEventBus();
export const accountRepository = new InMemoryAccountRepository();
export const transactionRepository = new InMemoryTransactionRepository();
export const loanRepaymentScheduleRepository = new InMemoryLoanRepaymentScheduleRepository();
export const loanRequestRepository = new InMemoryLoanRequestRepository();
export const overdraftRequestRepository = new InMemoryOverdraftRequestRepository();
export const conversationRepository = new InMemoryConversationRepository();
export const messageRepository = new InMemoryMessageRepository();

export const newsRepository = new InMemoryNewsRepository();
export const mediaRepository = new InMemoryMediaRepository();
export const contentRepository = new InMemoryContentRepository();

export const stockRepository = new InMemoryStockRepository();
export const stockOrderRepository = new InMemoryStockOrderRepository();
export const holdingRepository = new InMemoryStockHoldingRepository();
export const stockTransactionRepository = new InMemoryStockTransactionRepository();

export const savingsProductRepository = new InMemorySavingsProductRepository();
export const savingsAccountRepository = new InMemorySavingsAccountRepository();

export const beneficiaryRepository = new InMemoryBeneficiaryRepository();
export const beneficiaryGroupRepository = new InMemoryBeneficiaryGroupRepository();

export const notificationRepository = new InMemoryNotificationRepository();
