
import { InMemoryEventBus } from '../../../../adapters/repositories/InMemoryEventBus';
import { InMemoryAccountRepository } from '../../../../adapters/repositories/InMemoryAccountRepository';

export const eventBus = new InMemoryEventBus();
export const accountRepository = new InMemoryAccountRepository();
