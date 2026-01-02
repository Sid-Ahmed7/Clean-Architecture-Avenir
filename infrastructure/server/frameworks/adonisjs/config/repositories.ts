import { PasswordEncryptionService } from '../../../../adapters/services/auth/PasswordEncryptionService.js';

import { InMemoryEventBus } from '../../../../adapters/repositories/InMemoryEventBus.js';
import { InMemoryUserRepository } from '../../../../adapters/repositories/InMemoryUserRepository.js';
import { InMemoryRoleRepository } from '../../../../adapters/repositories/InMemoryRoleRepository.js';
import { InMemoryConversationRepository } from '../../../../adapters/repositories/InMemoryConversationRepository.js';
import { InMemoryMessageRepository } from '../../../../adapters/repositories/InMemoryMessageRepository.js';
import { InMemoryUserRoleRepository } from '../../../../adapters/repositories/InMemoryUserRoleRepository.js';
import { InMemoryAccountRepository } from '../../../../adapters/repositories/InMemoryAccountRepository.js';
import { InMemoryNewsRepository } from '../../../../adapters/repositories/InMemoryNewsRepository.js';
import { InMemoryMediaRepository } from '../../../../adapters/repositories/InMemoryMediaRepository.js';
import { InMemoryContentRepository } from '../../../../adapters/repositories/InMemoryContentRepository.js';
import { InMemoryStockRepository } from '../../../../adapters/repositories/InMemoryStockRepository.js';
import { InMemoryStockOrderRepository } from '../../../../adapters/repositories/InMemoryStockOrderRepository.js';
import { InMemoryStockHoldingRepository } from '../../../../adapters/repositories/InMemoryStockHoldingRepository.js';
import { InMemoryStockTransactionRepository } from '../../../../adapters/repositories/InMemoryStockTransactionRepository.js';
import { InMemoryTransactionRepository } from '../../../../adapters/repositories/InMemoryTransactionRepository.js';
import { InMemoryLoanRepaymentScheduleRepository } from '../../../../adapters/repositories/InMemoryLoanRepaymentScheduleRepository.js';
import { InMemoryLoanRequestRepository } from '../../../../adapters/repositories/InMemoryLoanRequestRepository.js';
import { InMemoryOverdraftRequestRepository } from '../../../../adapters/repositories/InMemoryOverdraftRequestRepository.js';
import { InMemorySavingsProductRepository } from '../../../../adapters/repositories/InMemorySavingsProductRepository.js';
import { InMemorySavingsAccountRepository } from '../../../../adapters/repositories/InMemorySavingsAccountRepository.js';
import { InMemoryBeneficiaryRepository } from '../../../../adapters/repositories/InMemoryBeneficiaryRepository.js';
import { InMemoryBeneficiaryGroupRepository } from '../../../../adapters/repositories/InMemoryBeneficiaryGroupRepository.js';
import { InMemoryNotificationRepository } from '../../../../adapters/repositories/InMemoryNotificationRepository.js';

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