import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateBeneficiaryGroupUseCase } from "#application/usecases/beneficiaries/groups/CreateBeneficiaryGroupUseCase.js";
import { GetGroupsByUserUseCase } from "#application/usecases/beneficiaries/groups/GetGroupsByUserUseCase.js";
import { AddBeneficiaryToGroupUseCase } from "#application/usecases/beneficiaries/groups/AddBeneficiaryToGroupUseCase.js";
import { RemoveBeneficiaryFromGroupUseCase } from "#application/usecases/beneficiaries/groups/RemoveBeneficiaryFromGroupUseCase.js";
import { DeleteBeneficiaryGroupUseCase } from "#application/usecases/beneficiaries/groups/DeleteBeneficiaryGroupUseCase.js";
import { UpdateBeneficiaryGroupUseCase } from "#application/usecases/beneficiaries/groups/UpdateBeneficiaryGroupUseCase.js";
import { TransferToGroupUseCase } from "#application/usecases/transfer/TransferToGroupUseCase.js";
import { SendNotificationToClientUseCase } from "#application/usecases/notification/SendNotificationToClientUseCase.js";
import type { BeneficiaryGroupRepositoryInterface } from "#application/ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface.js";
import type { BeneficiaryRepositoryInterface } from "#application/ports/repositories/beneficiaries/BeneficiaryRepositoryInterface.js";
import type { AccountRepositoryInterface } from "#application/ports/repositories/AccountRepositoryInterface.js";
import type { TransactionRepositoryInterface } from "#application/ports/repositories/TransactionRepositoryInterface.js";
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js";
import type { NotificationRepositoryInterface } from "#application/ports/repositories/notification/NotificationRepositoryInterface.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import type { NotificationService } from "#infrastructure/adapters/services/notification/NotificationService.js";
import { BeneficiaryGroupAlreadyExistsError } from "#application/errors/BeneficiaryGroupAlreadyExistsError.js";
import { BeneficiaryGroupNotFoundError } from "#application/errors/BeneficiaryGroupNotFoundError.js";
import { BeneficiaryNotFoundError } from "#application/errors/BeneficiaryNotFoundError.js";
import { AccountNotFoundError } from "#application/errors/AccountNotFoundError.js";
import { InsufficientFundsError } from "#application/errors/InsufficientFundsError.js";
import { UnauthorizedAccessError } from "#application/errors/UnauthorizedAccessError.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as beneficiaryValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/beneficiary.js";
import { transferToGroupValidator } from "#infrastructure/server/frameworks/adonisjs/app/validators/account.js";

@inject()
export default class BeneficiaryGroupsController {
  constructor(
    private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface,
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly notificationService: NotificationService,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async createBeneficiaryGroup({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const createBeneficiaryGroupUseCase = new CreateBeneficiaryGroupUseCase(
      this.beneficiaryGroupRepository,
      this.uuidService,
      sendNotificationUseCase
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: beneficiaryValidator.createBeneficiaryGroupValidator, data: request.body()});
    const groupData = {
      userId,
      groupName: input.groupName,
      beneficiaryIds: input.beneficiaryIds,
    };

    const result = await createBeneficiaryGroupUseCase.execute(groupData);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryGroupAlreadyExistsError) {
        return response.status(409).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async getGroupsByUser({ response, auth }: HttpContext) {
    const getGroupsByUserUseCase = new GetGroupsByUserUseCase(this.beneficiaryGroupRepository);

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const result = await getGroupsByUserUseCase.execute(userId);

    return response.status(200).json(result);
  }

  async addBeneficiaryToGroup({ request, response }: HttpContext) {
    const addBeneficiaryToGroupUseCase = new AddBeneficiaryToGroupUseCase(
      this.beneficiaryGroupRepository,
      this.beneficiaryRepository
    );

    const groupId = request.param('groupId');
    if (!groupId) {
      return response.status(400).json({ error: "Beneficiaries Group Id must be provided" });
    }

    const input = await vine.validate({schema: beneficiaryValidator.addBeneficiaryToGroupValidator, data: request.body()});
    const result = await addBeneficiaryToGroupUseCase.execute(groupId, input.beneficiaryId);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryGroupNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      if (result instanceof BeneficiaryNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async removeBeneficiaryFromGroup({ request, response }: HttpContext) {
    const removeBeneficiaryFromGroupUseCase = new RemoveBeneficiaryFromGroupUseCase(
      this.beneficiaryGroupRepository
    );

    const groupId = request.param('groupId');
    const beneficiaryId = request.param('beneficiaryId');

    if (!groupId) {
      return response.status(400).json({ error: "Beneficiaries Group Id must be provided" });
    }

    if (!beneficiaryId) {
      return response.status(400).json({ error: "Beneficiary Id must be provided" });
    }

    const result = await removeBeneficiaryFromGroupUseCase.execute(groupId, beneficiaryId);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryGroupNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async updateBeneficiaryGroup({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const updateBeneficiaryGroupUseCase = new UpdateBeneficiaryGroupUseCase(
      this.beneficiaryGroupRepository,
      sendNotificationUseCase
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const groupId = request.param('groupId');

    if (!groupId) {
      return response.status(400).json({ error: "Beneficiaries Group Id must be provided" });
    }

    const input = await vine.validate({schema: beneficiaryValidator.updateBeneficiaryGroupValidator, data: request.body()});
    const updateData = {
      groupId,
      userId,
      ...(input.groupName !== undefined && { groupName: input.groupName }),
      ...(input.beneficiaryIds !== undefined && { beneficiaryIds: input.beneficiaryIds }),
    };

    const result = await updateBeneficiaryGroupUseCase.execute(updateData);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryGroupNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async deleteBeneficiaryGroup({ request, response }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const deleteBeneficiaryGroupUseCase = new DeleteBeneficiaryGroupUseCase(
      this.beneficiaryGroupRepository,
      sendNotificationUseCase
    );

    const groupId = request.param('groupId');

    if (!groupId) {
      return response.status(400).json({ error: "Beneficiaries Group Id must be provided" });
    }

    const result = await deleteBeneficiaryGroupUseCase.execute(groupId);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryGroupNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json({ message: "Beneficiary group deleted successfully" });
  }

  async transferToGroup({ request, response, auth }: HttpContext) {
    if (!this.accountRepository || !this.transactionRepository) {
      return response.status(500).json({ error: "Account or transaction repository not configured" });
    }

    const transferToGroupUseCase = new TransferToGroupUseCase(
      this.beneficiaryGroupRepository,
      this.beneficiaryRepository,
      this.accountRepository,
      this.transactionRepository,
      this.uuidService
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: transferToGroupValidator, data: request.body()});
    const transferData = {
      userId,
      groupId: input.groupId,
      sourceAccountNumber: input.sourceAccountNumber,
      amountPerBeneficiary: input.amountPerBeneficiary,
    };

    const result = await transferToGroupUseCase.execute(transferData);

    if (result instanceof Error) {
      if (result instanceof BeneficiaryGroupNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

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
