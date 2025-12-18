import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { UserNotFoundError } from "../../errors/UserNotFoundError";

export class DeleteUserUseCase {
    public constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface
    ) {}

    public async execute(userId: string) {
        // Verify user exists
        const user = await this.userRepository.findById(userId);
        if (user instanceof Error) {
            return user;
        }

        // Delete all user's accounts (checking accounts)
        const userAccounts = await this.accountRepository.getAccountsByUserId(userId);
        if (!(userAccounts instanceof Error)) {
            for (const account of userAccounts) {
                await this.accountRepository.deleteAccount(account.accountNumber);
            }
        }

        // Delete all user's savings accounts
        const userSavingsAccounts = await this.savingsAccountRepository.getSavingsAccountsByUserId(userId);
        if (!(userSavingsAccounts instanceof Error)) {
            for (const savingsAccount of userSavingsAccounts) {
                await this.savingsAccountRepository.deleteSavingsAccount(savingsAccount.accountNumber);
            }
        }

        // Finally, delete the user
        const result = await this.userRepository.deleteUser(userId);
        if (result instanceof Error) {
            return result;
        }

        return { success: true, message: `User ${userId} and all related data deleted successfully` };
    }
}
