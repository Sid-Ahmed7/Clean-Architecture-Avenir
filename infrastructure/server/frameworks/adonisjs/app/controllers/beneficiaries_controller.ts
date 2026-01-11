import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CreateBeneficiaryUseCase } from "#application/usecases/beneficiaries/CreateBeneficiaryUseCase.js";
import { GetBeneficiariesByUserUseCase } from "#application/usecases/beneficiaries/GetBeneficiariesByUserUseCase.js";
import { UpdateBeneficiaryUseCase } from "#application/usecases/beneficiaries/UpdateBeneficiaryUseCase.js";
import { DeleteBeneficiaryUseCase } from "#application/usecases/beneficiaries/DeleteBeneficiaryUseCase.js";
import { TransferToBeneficiaryUseCase } from "#application/usecases/transfer/TransferToBeneficiaryUseCase.js";
import { SendNotificationToClientUseCase } from "#application/usecases/notification/SendNotificationToClientUseCase.js";
import type { BeneficiaryRepositoryInterface } from "#application/ports/repositories/beneficiaries/BeneficiaryRepositoryInterface.js";
import type { AccountRepositoryInterface } from "#application/ports/repositories/AccountRepositoryInterface.js";
import type { TransactionRepositoryInterface } from "#application/ports/repositories/TransactionRepositoryInterface.js";
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js";
import type { NotificationRepositoryInterface } from "#application/ports/repositories/notification/NotificationRepositoryInterface.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import type { NotificationService } from "#infrastructure/adapters/services/notification/NotificationService.js";
import { BeneficiaryAlreadyExistsError } from "#application/errors/BeneficiaryAlreadyExistsError.js";
import { BeneficiaryNotFoundError } from "#application/errors/BeneficiaryNotFoundError.js";
import { IbanNotFoundError } from "#application/errors/IbanNotFoundError.js";
import { AccountNotFoundError } from "#application/errors/AccountNotFoundError.js";
import { InsufficientFundsError } from "#application/errors/InsufficientFundsError.js";
import { UnauthorizedAccessError } from "#application/errors/UnauthorizedAccessError.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as beneficiaryValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/beneficiary.js";
import { transferToBeneficiaryValidator } from "#infrastructure/server/frameworks/adonisjs/app/validators/account.js";

@inject()
export default class BeneficiariesController {
  constructor(
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly notificationService: NotificationService
  ) {}

  async createBeneficiary({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const createBeneficiaryUseCase = new CreateBeneficiaryUseCase(
      this.beneficiaryRepository,
      this.accountRepository,
      this.uuidService,
      sendNotificationUseCase
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: beneficiaryValidator.createBeneficiaryValidator, data: request.body()});
    const beneficiaryData = {
      userId,
      iban: input.iban,
      beneficiaryName: input.beneficiaryName,
      ...(input.email && { email: input.email }),
      ...(input.country && { country: input.country }),
      ...(input.address && { address: input.address }),
    };

    const result = await createBeneficiaryUseCase.execute(beneficiaryData);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryAlreadyExistsError) {
        return response.status(409).json({ error: result.message });
      }

      if (result instanceof IbanNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async getBeneficiariesByUser({ response, auth }: HttpContext) {
    const getBeneficiariesUseCase = new GetBeneficiariesByUserUseCase(this.beneficiaryRepository);

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const result = await getBeneficiariesUseCase.execute(userId);
    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async updateBeneficiary({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const updateBeneficiaryUseCase = new UpdateBeneficiaryUseCase(
      this.beneficiaryRepository,
      sendNotificationUseCase
    );

    const beneficiaryId = request.param('beneficiaryId');
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    if (!beneficiaryId) {
      return response.status(400).json({ error: "Beneficiary Id must be provided" });
    }

    const input = await vine.validate({schema: beneficiaryValidator.updateBeneficiaryValidator, data: request.body()});
    const payload = {
      beneficiaryId,
      userId,
      ...(input.beneficiaryName && { beneficiaryName: input.beneficiaryName }),
      ...(input.email && { email: input.email }),
      ...(input.country && { country: input.country }),
      ...(input.address && { address: input.address }),
    };

    const result = await updateBeneficiaryUseCase.execute(payload);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async deleteBeneficiary({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const deleteBeneficiaryUseCase = new DeleteBeneficiaryUseCase(
      this.beneficiaryRepository,
      sendNotificationUseCase
    );

    const beneficiaryId = request.param('beneficiaryId');
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    if (!beneficiaryId) {
      return response.status(400).json({ error: "Beneficiary Id must be provided" });
    }

    const result = await deleteBeneficiaryUseCase.execute(beneficiaryId, userId);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json({ message: "Beneficiary deleted successfully" });
  }

  async transferToBeneficiary({ request, response, auth }: HttpContext) {
    if (!this.transactionRepository) {
      return response.status(500).json({ error: "Transaction repository not configured" });
    }

    const transferToBeneficiaryUseCase = new TransferToBeneficiaryUseCase(
      this.beneficiaryRepository,
      this.accountRepository,
      this.transactionRepository,
      this.uuidService
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: transferToBeneficiaryValidator, data: request.body()});
    const transferData = {
      userId,
      beneficiaryId: input.beneficiaryId,
      sourceAccountNumber: input.sourceAccountNumber,
      amount: input.amount,
    };

    const result = await transferToBeneficiaryUseCase.execute(transferData);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      if (result instanceof AccountNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      if (result instanceof InsufficientFundsError) {
        return response.status(400).json({ error: result.message });
      }

      if (result instanceof UnauthorizedAccessError) {
        return response.status(403).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
