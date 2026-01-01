import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateSavingsProductUseCase } from "#application/usecases/accounts/CreateSavingsProductUseCase.js";
import { GetAllSavingsProductsUseCase } from "#application/usecases/accounts/GetAllSavingsProductsUseCase.js";
import { UpdateSavingsProductUseCase } from "#application/usecases/accounts/UpdateSavingsProductUseCase.js";
import { SubscribeToSavingsProductUseCase } from "#application/usecases/accounts/SubscribeToSavingsProductUseCase.js";
import type { SavingsProductRepositoryInterface } from "#application/ports/repositories/SavingsProductRepositoryInterface.js";
import type { SavingsAccountRepositoryInterface } from "#application/ports/repositories/SavingsAccountRepositoryInterface.js";
import type { AccountRepositoryInterface } from "#application/ports/repositories/AccountRepositoryInterface.js";
import type { UuidGeneratorService } from "#application/ports/services/UuidGeneratorService.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as savingsProductValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/savings_product.js";

@inject()
export default class SavingsProductsController {
  constructor(
    private readonly savingsProductRepository: SavingsProductRepositoryInterface,
    private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly uuidService: UuidGeneratorService
  ) {}

  async createProduct({ request, response }: HttpContext) {
    const createProductUseCase = new CreateSavingsProductUseCase(
      this.savingsProductRepository,
      this.uuidService
    );

    const input = await vine.validate({schema: savingsProductValidator.createSavingsProductValidator, data: request.body()});
    const dto = {
      name: input.name,
      description: input.description,
      interestRate: input.interestRate,
      maxDepositAmount: input.maxDepositAmount ?? null,
      minDepositAmount: input.minDepositAmount ?? null
    };

    const result = await createProductUseCase.execute(dto);

    if (result instanceof Error) {
      return response.status(400).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async getAllProducts({ request, response }: HttpContext) {
    const getAllProductsUseCase = new GetAllSavingsProductsUseCase(this.savingsProductRepository);
    const activeOnly = request.qs().activeOnly === 'true';

    const products = await getAllProductsUseCase.execute(activeOnly);
    return response.status(200).json(products);
  }

  async updateProduct({ request, response }: HttpContext) {
    const updateProductUseCase = new UpdateSavingsProductUseCase(
      this.savingsProductRepository,
      this.savingsAccountRepository
    );

    const productId = request.param('productId');
    const input = await vine.validate({schema: savingsProductValidator.updateSavingsProductValidator, data: request.body()});

    const dto = {
      productId: productId as string,
      ...(input.interestRate !== undefined && { interestRate: input.interestRate }),
      ...(input.maxDepositAmount !== undefined && {
        maxDepositAmount: input.maxDepositAmount
      }),
      ...(input.minDepositAmount !== undefined && {
        minDepositAmount: input.minDepositAmount
      }),
      ...(input.isActive !== undefined && { isActive: input.isActive })
    };

    const result = await updateProductUseCase.execute(dto);

    if (result instanceof Error) {
      return response.status(400).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async subscribeToProduct({ request, response, auth }: HttpContext) {
    const subscribeUseCase = new SubscribeToSavingsProductUseCase(
      this.savingsAccountRepository,
      this.savingsProductRepository,
      this.accountRepository
    );

    const userId = auth?.userId;
    if (!userId) {
      return response.status(401).json({ error: "User not authenticated" });
    }

    const input = await vine.validate({schema: savingsProductValidator.subscribeToProductValidator, data: request.body()});
    const dto = {
      userId,
      productId: input.productId,
      ...(input.initialDeposit && { initialDeposit: input.initialDeposit })
    };

    const result = await subscribeUseCase.execute(dto);

    if (result instanceof Error) {
      return response.status(400).json({ error: result.message });
    }

    return response.status(201).json(result);
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
