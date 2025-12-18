import { Request, Response } from "express";
import { CreateSavingsAccountUseCase } from "../../../../../application/usecases/accounts/CreateSavingsAccountUseCase";
import { UpdateSavingsAccountConfigUseCase } from "../../../../../application/usecases/accounts/UpdateSavingsAccountConfigUseCase";
import { GetSavingsAccountUseCase } from "../../../../../application/usecases/accounts/GetSavingsAccountUseCase";
import { CalculateDailyInterestUseCase } from "../../../../../application/usecases/accounts/CalculateDailyInterestUseCase";
import { GetAccountInterestHistoryUseCase } from "../../../../../application/usecases/accounts/GetAccountInterestHistoryUseCase";
import { InMemorySavingsAccountRepository } from "../../../../adapters/repositories/InMemorySavingsAccountRepository";
import { InMemoryAccountRepository } from "../../../../adapters/repositories/InMemoryAccountRepository";
import { AccountNotFoundError } from "../../../../../application/errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../../../domain/errors/InvalidAccountError";
import { CreateSavingsAccount } from "../../../../../application/requests/CreateSavingsAccount";
import { UpdateSavingsAccountConfig } from "../../../../../application/requests/UpdateSavingsAccountConfig";

export class SavingsAccountController {

    constructor(
        private readonly savingsAccountRepository: InMemorySavingsAccountRepository,
        private readonly accountRepository: InMemoryAccountRepository
    ) {}

    async createSavingsAccount(req: Request, res: Response) {
        const createSavingsAccountUseCase = new CreateSavingsAccountUseCase(this.savingsAccountRepository);

        const dto: CreateSavingsAccount = {
            accountNumber: Number(req.body.accountNumber),
            productId: req.body.productId,
            userId: req.body.userId,
            interestRate: Number(req.body.interestRate),
            maxDepositAmount: req.body.maxDepositAmount ? Number(req.body.maxDepositAmount) : null,
            ...(req.body.maturity && { maturity: new Date(req.body.maturity) })
        };

        const result = await createSavingsAccountUseCase.execute(dto);

        if (result instanceof Error) {
            if (result instanceof InvalidAccountError) {
                return res.status(400).json({ error: result.message });
            }
            return res.status(500).json({ error: result.message });
        }

        return res.status(201).json(result);
    }

    async getSavingsAccount(req: Request, res: Response) {
        const getSavingsAccountUseCase = new GetSavingsAccountUseCase(this.savingsAccountRepository);
        const accountNumber = Number(req.params.accountNumber);

        const result = await getSavingsAccountUseCase.execute(accountNumber);

        if (result instanceof AccountNotFoundError) {
            return res.status(404).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async updateSavingsAccountConfig(req: Request, res: Response) {
        const updateSavingsAccountConfigUseCase = new UpdateSavingsAccountConfigUseCase(this.savingsAccountRepository);

        const dto: UpdateSavingsAccountConfig = {
            accountNumber: Number(req.params.accountNumber),
            ...(req.body.interestRate !== undefined && { interestRate: Number(req.body.interestRate) }),
            ...(req.body.maxDepositAmount !== undefined && { maxDepositAmount: req.body.maxDepositAmount === null ? null : Number(req.body.maxDepositAmount) }),
            ...(req.body.isActive !== undefined && { isActive: Boolean(req.body.isActive) })
        };

        const result = await updateSavingsAccountConfigUseCase.execute(dto);

        if (result instanceof Error) {
            if (result instanceof AccountNotFoundError) {
                return res.status(404).json({ error: result.message });
            }
            if (result instanceof InvalidAccountError) {
                return res.status(400).json({ error: result.message });
            }
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async updateInterestRate(req: Request, res: Response) {
        const updateSavingsAccountConfigUseCase = new UpdateSavingsAccountConfigUseCase(this.savingsAccountRepository);

        const dto: UpdateSavingsAccountConfig = {
            accountNumber: Number(req.params.accountNumber),
            interestRate: Number(req.body.interestRate)
        };

        const result = await updateSavingsAccountConfigUseCase.execute(dto);

        if (result instanceof Error) {
            if (result instanceof AccountNotFoundError) {
                return res.status(404).json({ error: result.message });
            }
            if (result instanceof InvalidAccountError) {
                return res.status(400).json({ error: result.message });
            }
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async updateMaxDeposit(req: Request, res: Response) {
        const updateSavingsAccountConfigUseCase = new UpdateSavingsAccountConfigUseCase(this.savingsAccountRepository);

        const dto: UpdateSavingsAccountConfig = {
            accountNumber: Number(req.params.accountNumber),
            maxDepositAmount: req.body.maxDepositAmount === null ? null : Number(req.body.maxDepositAmount)
        };

        const result = await updateSavingsAccountConfigUseCase.execute(dto);

        if (result instanceof Error) {
            if (result instanceof AccountNotFoundError) {
                return res.status(404).json({ error: result.message });
            }
            if (result instanceof InvalidAccountError) {
                return res.status(400).json({ error: result.message });
            }
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async calculateDailyInterest(req: Request, res: Response) {
        const calculateDailyInterestUseCase = new CalculateDailyInterestUseCase(
            this.savingsAccountRepository,
            this.accountRepository
        );

        const result = await calculateDailyInterestUseCase.execute();

        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json({
            message: "Daily interest calculated successfully",
            results: result
        });
    }

    async getInterestSummary(req: Request, res: Response) {
        const getAccountInterestHistoryUseCase = new GetAccountInterestHistoryUseCase(
            this.savingsAccountRepository,
            this.accountRepository
        );

        const accountNumber = Number(req.params.accountNumber);
        const result = await getAccountInterestHistoryUseCase.execute(accountNumber);

        if (result instanceof Error) {
            if (result instanceof AccountNotFoundError) {
                return res.status(404).json({ error: result.message });
            }
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async getAllSavingsAccounts(req: Request, res: Response) {
        const accounts = await this.savingsAccountRepository.getAllSavingsAccounts();
        
        // Calculate real-time interest for each account
        const accountsWithInterest = accounts.map(account => {
            const daysSinceLastUpdate = Math.floor(
                (new Date().getTime() - account.lastBalanceUpdate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const pendingInterest = (account.balance * account.interestRate * daysSinceLastUpdate) / (365 * 100);
            
            return {
                ...account,
                totalInterestEarned: account.totalInterestEarned + pendingInterest
            };
        });
        
        // If user is a client, filter to show only their accounts
        const user = (req as any).user;
        if (user && user.role === 'CLIENT') {
            const userAccounts = accountsWithInterest.filter(acc => acc.userId === user.userId);
            return res.status(200).json(userAccounts);
        }
        
        // Managers see all accounts
        return res.status(200).json(accountsWithInterest);
    }

    async depositToSavingsAccount(req: Request, res: Response) {
        const { DepositToSavingsAccountUseCase } = require("../../../../../application/usecases/accounts/DepositToSavingsAccountUseCase");
        const { transactionRepository } = require("../../../../adapters/config/repositories");
        const { savingsProductRepository } = require("../../../../adapters/config/repositories");
        
        const depositUseCase = new DepositToSavingsAccountUseCase(
            this.savingsAccountRepository,
            savingsProductRepository,
            this.accountRepository,
            transactionRepository
        );

        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const dto = {
            userId,
            savingsAccountNumber: Number(req.params.accountNumber),
            amount: Number(req.body.amount)
        };

        const result = await depositUseCase.execute(dto);

        if (result instanceof Error) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async withdrawFromSavingsAccount(req: Request, res: Response) {
        const { WithdrawFromSavingsAccountUseCase } = require("../../../../../application/usecases/accounts/WithdrawFromSavingsAccountUseCase");
        const { transactionRepository } = require("../../../../adapters/config/repositories");
        
        const withdrawUseCase = new WithdrawFromSavingsAccountUseCase(
            this.savingsAccountRepository,
            this.accountRepository,
            transactionRepository
        );

        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const dto = {
            userId,
            savingsAccountNumber: Number(req.params.accountNumber),
            amount: Number(req.body.amount)
        };

        const result = await withdrawUseCase.execute(dto);

        if (result instanceof Error) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async deleteSavingsAccount(req: Request, res: Response) {
        const { DeleteSavingsAccountUseCase } = require("../../../../../application/usecases/accounts/DeleteSavingsAccountUseCase");
        const { NoCheckingAccountForTransferError } = require("../../../../../application/errors/NoCheckingAccountForTransferError");
        
        const deleteUseCase = new DeleteSavingsAccountUseCase(
            this.savingsAccountRepository,
            this.accountRepository
        );

        const accountNumber = Number(req.params.accountNumber);
        const result = await deleteUseCase.execute(accountNumber);

        if (result instanceof Error) {
            if (result instanceof AccountNotFoundError) {
                return res.status(404).json({ error: result.message });
            }
            if (result instanceof NoCheckingAccountForTransferError) {
                return res.status(400).json({ error: result.message });
            }
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json({ message: "Savings account deleted successfully" });
    }
}
