
import { InMemoryEventBus } from '../../../../adapters/repositories/InMemoryEventBus';
import { InMemoryAccountRepository } from '../../../../adapters/repositories/InMemoryAccountRepository';
import { InMemoryTransactionRepository } from '../../../../adapters/repositories/InMemoryTransactionRepository';

export const eventBus = new InMemoryEventBus();
export const accountRepository = new InMemoryAccountRepository();
export const transactionRepository = new InMemoryTransactionRepository();
