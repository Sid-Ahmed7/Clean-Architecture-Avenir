import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CreateSavingsAccountUseCase } from "#application/usecases/accounts/CreateSavingsAccountUseCase.js";
import { UpdateSavingsAccountConfigUseCase } from "#application/usecases/accounts/UpdateSavingsAccountConfigUseCase.js";
import { GetSavingsAccountUseCase } from "#application/usecases/accounts/GetSavingsAccountUseCase.js";
import { CalculateDailyInterestUseCase } from "#application/usecases/accounts/CalculateDailyInterestUseCase.js";
import { GetAccountInterestHistoryUseCase } from "#application/usecases/accounts/GetAccountInterestHistoryUseCase.js";
import { DeleteSavingsAccountUseCase } from "#application/usecases/accounts/DeleteSavingsAccountUseCase.js";
import { DepositToSavingsAccountUseCase } from "#application/usecases/accounts/DepositToSavingsAccountUseCase.js";
import { WithdrawFromSavingsAccountUseCase } from "#application/usecases/accounts/WithdrawFromSavingsAccountUseCase.js";
import { SendNotificationToClientUseCase } from "#application/usecases/notification/SendNotificationToClientUseCase.js";
import type { SavingsAccountRepositoryInterface } from "#application/ports/repositories/SavingsAccountRepositoryInterface.js";
import type { AccountRepositoryInterface } from "#application/ports/repositories/AccountRepositoryInterface.js";
import type { SavingsProductRepositoryInterface } from "#application/ports/repositories/SavingsProductRepositoryInterface.js";
import type { TransactionRepositoryInterface } from "#application/ports/repositories/TransactionRepositoryInterface.js";
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js";
import type { NotificationRepositoryInterface } from "#application/ports/repositories/notification/NotificationRepositoryInterface.js";
import type { NotificationService } from "#infrastructure/adapters/services/notification/NotificationService.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import { AccountNotFoundError } from "#application/errors/AccountNotFoundError.js";
import { InvalidAccountError } from "#domain/errors/InvalidAccountError.js";
import { NoCheckingAccountForTransferError } from "#application/errors/NoCheckingAccountForTransferError.js";
import { RoleEnum } from "#domain/enums/RoleEnum.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as savingsAccountValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/savings_account.js";

@inject()
export default class SavingsAccountsController {
  constructor(
    private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly savingsProductRepository: SavingsProductRepositoryInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly notificationService: NotificationService,
    private readonly uuidService: CryptoUuidGenerator
  ) {}

  async createSavingsAccount({ request, response }: HttpContext) {
    const createSavingsAccountUseCase = new CreateSavingsAccountUseCase(this.savingsAccountRepository);

    const input = await vine.validate({schema: savingsAccountValidator.createSavingsAccountValidator, data: request.body()});
    const dto = {
      accountNumber: input.accountNumber,
      productId: input.productId,
      userId: input.userId,
      interestRate: input.interestRate,
      maxDepositAmount: input.maxDepositAmount ?? null,
      ...(input.maturity && { maturity: input.maturity })
    };

    const result = await createSavingsAccountUseCase.execute(dto);

    if (result instanceof Error) {
      if (result instanceof InvalidAccountError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async getSavingsAccount({ request, response }: HttpContext) {
    const getSavingsAccountUseCase = new GetSavingsAccountUseCase(this.savingsAccountRepository);
    const accountNumber = Number(request.param('accountNumber'));

    const result = await getSavingsAccountUseCase.execute(accountNumber);

    if (result instanceof AccountNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async updateSavingsAccountConfig({ request, response }: HttpContext) {
    const updateSavingsAccountConfigUseCase = new UpdateSavingsAccountConfigUseCase(
      this.savingsAccountRepository
    );

    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: savingsAccountValidator.updateSavingsAccountConfigValidator, data: request.body()});

    const dto = {
      accountNumber,
      ...(input.interestRate !== undefined && { interestRate: input.interestRate }),
      ...(input.maxDepositAmount !== undefined && {
        maxDepositAmount: input.maxDepositAmount
      }),
      ...(input.isActive !== undefined && { isActive: input.isActive })
    };

    const result = await updateSavingsAccountConfigUseCase.execute(dto);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InvalidAccountError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async updateInterestRate({ request, response }: HttpContext) {
    const updateSavingsAccountConfigUseCase = new UpdateSavingsAccountConfigUseCase(
      this.savingsAccountRepository
    );

    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: savingsAccountValidator.updateInterestRateValidator, data: request.body()});

    const dto = {
      accountNumber,
      interestRate: input.interestRate
    };

    const result = await updateSavingsAccountConfigUseCase.execute(dto);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InvalidAccountError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async updateMaxDeposit({ request, response }: HttpContext) {
    const updateSavingsAccountConfigUseCase = new UpdateSavingsAccountConfigUseCase(
      this.savingsAccountRepository
    );

    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: savingsAccountValidator.updateMaxDepositValidator, data: request.body()});

    const dto = {
      accountNumber,
      maxDepositAmount: input.maxDepositAmount
    };

    const result = await updateSavingsAccountConfigUseCase.execute(dto);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InvalidAccountError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async calculateDailyInterest({ response }: HttpContext) {
    const calculateDailyInterestUseCase = new CalculateDailyInterestUseCase(
      this.savingsAccountRepository,
      this.accountRepository
    );

    const result = await calculateDailyInterestUseCase.execute();

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json({
      message: "Daily interest calculated successfully",
      results: result
    });
  }

  async getInterestSummary({ request, response }: HttpContext) {
    const getAccountInterestHistoryUseCase = new GetAccountInterestHistoryUseCase(
      this.savingsAccountRepository,
      this.accountRepository
    );

    const accountNumber = Number(request.param('accountNumber'));
    const result = await getAccountInterestHistoryUseCase.execute(accountNumber);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getAllSavingsAccounts({ response, auth }: HttpContext) {
    const accounts = await this.savingsAccountRepository.getAllSavingsAccounts();

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

    const user = auth;
    const roles = auth?.roles ?? [];

    if (user && roles.includes(RoleEnum.CLIENT)) {
      const userAccounts = accountsWithInterest.filter(acc => acc.userId === user.userId);
      return response.status(200).json(userAccounts);
    }

    return response.status(200).json(accountsWithInterest);
  }

  async depositToSavingsAccount({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const depositUseCase = new DepositToSavingsAccountUseCase(
      this.savingsAccountRepository,
      this.savingsProductRepository,
      this.accountRepository,
      sendNotificationUseCase
    );

    const userId = auth?.userId;
    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: savingsAccountValidator.depositToSavingsAccountValidator, data: request.body()});

    const dto = {
      userId,
      savingsAccountNumber: accountNumber,
      amount: input.amount
    };

    const result = await depositUseCase.execute(dto);

    if (result instanceof Error) {
      return response.status(400).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async withdrawFromSavingsAccount({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const withdrawUseCase = new WithdrawFromSavingsAccountUseCase(
      this.savingsAccountRepository,
      this.accountRepository,
      this.transactionRepository,
      sendNotificationUseCase
    );

    const userId = auth?.userId;
    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const accountNumber = Number(request.param('accountNumber'));
    const input = await vine.validate({schema: savingsAccountValidator.withdrawFromSavingsAccountValidator, data: request.body()});

    const dto = {
      userId,
      savingsAccountNumber: accountNumber,
      amount: input.amount
    };

    const result = await withdrawUseCase.execute(dto);

    if (result instanceof Error) {
      return response.status(400).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async deleteSavingsAccount({ request, response }: HttpContext) {
    const deleteUseCase = new DeleteSavingsAccountUseCase(
      this.savingsAccountRepository,
      this.accountRepository
    );

    const accountNumber = Number(request.param('accountNumber'));
    const result = await deleteUseCase.execute(accountNumber);

    if (result instanceof Error) {
      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof NoCheckingAccountForTransferError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json({ message: "Savings account deleted successfully" });
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
