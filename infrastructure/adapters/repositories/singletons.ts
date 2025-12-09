// Singleton repositories - shared across all routes
import { InMemorySavingsProductRepository } from "./InMemorySavingsProductRepository";
import { InMemorySavingsAccountRepository } from "./InMemorySavingsAccountRepository";
import { accountRepository } from "../config/repositories";

// Create single instances for savings-specific repositories
export const savingsProductRepository = new InMemorySavingsProductRepository();
export const savingsAccountRepository = new InMemorySavingsAccountRepository();

// Export the shared accountRepository from config
export { accountRepository };
