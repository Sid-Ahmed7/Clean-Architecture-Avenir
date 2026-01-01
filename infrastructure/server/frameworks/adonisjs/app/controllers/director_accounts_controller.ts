import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { GetAllAccountsUseCase } from "#application/usecases/accounts/GetAllAccountsUseCase.js";
import { GetAllSavingsAccountsUseCase } from "#application/usecases/accounts/GetAllSavingsAccountsUseCase.js";
import type { AccountRepositoryInterface } from "#application/ports/repositories/AccountRepositoryInterface.js";
import type { SavingsAccountRepositoryInterface } from "#application/ports/repositories/SavingsAccountRepositoryInterface.js";
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js";
import { AuthContext } from '#types/JwtPayload';

@inject()
export default class DirectorAccountsController {
  constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async getAllAccounts({ response }: HttpContext) {
    const getAllAccountsUseCase = new GetAllAccountsUseCase(this.accountRepository);
    const accounts = await getAllAccountsUseCase.execute();

    const accountsWithUserInfo = await Promise.all(
      accounts.map(async (account) => {
        const user = await this.userRepository.findById(account.userId);
        const userName = user instanceof Error
          ? "Unknown User"
          : `${user.firstName} ${user.lastName}`;

        return {
          accountNumber: account.accountNumber,
          iban: account.iban,
          balance: account.currentBalance,
          accountType: account.accountType,
          accountStatus: account.accountStatus,
          isActive: account.isActive,
          userId: account.userId,
          userName: userName,
          createdAt: account.createdAt
        };
      })
    );

    return response.status(200).json(accountsWithUserInfo);
  }

  async getAllSavingsAccounts({ response }: HttpContext) {
    const getAllSavingsAccountsUseCase = new GetAllSavingsAccountsUseCase(
      this.savingsAccountRepository
    );
    const savingsAccounts = await getAllSavingsAccountsUseCase.execute();

    const savingsAccountsWithUserInfo = await Promise.all(
      savingsAccounts.map(async (account) => {
        const user = await this.userRepository.findById(account.userId);
        const userName = user instanceof Error
          ? "Unknown User"
          : `${user.firstName} ${user.lastName}`;

        return {
          accountNumber: account.accountNumber,
          balance: account.balance,
          interestRate: account.interestRate,
          productId: account.productId,
          isActive: account.isActive,
          totalInterestEarned: account.totalInterestEarned,
          userId: account.userId,
          userName: userName,
          lastBalanceUpdate: account.lastBalanceUpdate,
          lastInterestApplied: account.lastInterestApplied
        };
      })
    );

    return response.status(200).json(savingsAccountsWithUserInfo);
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
