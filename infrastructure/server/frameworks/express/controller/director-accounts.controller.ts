import { Request, Response } from "express";
import { GetAllAccountsUseCase } from "../../../../../application/usecases/accounts/GetAllAccountsUseCase";
import { GetAllSavingsAccountsUseCase } from "../../../../../application/usecases/accounts/GetAllSavingsAccountsUseCase";
import { InMemoryAccountRepository } from "../../../../adapters/repositories/InMemoryAccountRepository";
import { InMemorySavingsAccountRepository } from "../../../../adapters/repositories/InMemorySavingsAccountRepository";
import { InMemoryUserRepository } from "../../../../adapters/repositories/InMemoryUserRepository";

export class DirectorAccountsController {
    constructor(
        private readonly accountRepository: InMemoryAccountRepository,
        private readonly savingsAccountRepository: InMemorySavingsAccountRepository,
        private readonly userRepository: InMemoryUserRepository
    ) {}

    async getAllAccounts(req: Request, res: Response) {
        const getAllAccountsUseCase = new GetAllAccountsUseCase(this.accountRepository);
        const accounts = await getAllAccountsUseCase.execute();

        // Enrich accounts with user information
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

        return res.status(200).json(accountsWithUserInfo);
    }

    async getAllSavingsAccounts(req: Request, res: Response) {
        const getAllSavingsAccountsUseCase = new GetAllSavingsAccountsUseCase(
            this.savingsAccountRepository
        );
        const savingsAccounts = await getAllSavingsAccountsUseCase.execute();

        // Enrich savings accounts with user information
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

        return res.status(200).json(savingsAccountsWithUserInfo);
    }
}
