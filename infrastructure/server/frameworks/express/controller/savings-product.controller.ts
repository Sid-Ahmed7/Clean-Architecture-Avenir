import { Request, Response } from "express";
import { CreateSavingsProductUseCase } from "../../../../../application/usecases/accounts/CreateSavingsProductUseCase";
import { GetAllSavingsProductsUseCase } from "../../../../../application/usecases/accounts/GetAllSavingsProductsUseCase";
import { UpdateSavingsProductUseCase } from "../../../../../application/usecases/accounts/UpdateSavingsProductUseCase";
import { SubscribeToSavingsProductUseCase } from "../../../../../application/usecases/accounts/SubscribeToSavingsProductUseCase";
import { SavingsProductRepositoryInterface } from "../../../../../application/ports/repositories/SavingsProductRepositoryInterface";
import { SavingsAccountRepositoryInterface } from "../../../../../application/ports/repositories/SavingsAccountRepositoryInterface";
import { AccountRepositoryInterface } from "../../../../../application/ports/repositories/AccountRepositoryInterface";
import { CreateSavingsProduct } from "../../../../../application/requests/CreateSavingsProduct";
import { UpdateSavingsProduct } from "../../../../../application/requests/UpdateSavingsProduct";
import { CryptoUuidGenerator } from "../../../../adapters/services/CryptoUuidGenerator";

export class SavingsProductController {
    constructor(
        private readonly savingsProductRepository: SavingsProductRepositoryInterface,
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly uuidService: CryptoUuidGenerator
    ) {}

    async createProduct(req: Request, res: Response) {
        const createProductUseCase = new CreateSavingsProductUseCase(
            this.savingsProductRepository,
            this.uuidService
        );

        const dto: CreateSavingsProduct = {
            name: req.body.name,
            description: req.body.description,
            interestRate: Number(req.body.interestRate),
            maxDepositAmount: req.body.maxDepositAmount ? Number(req.body.maxDepositAmount) : null,
            minDepositAmount: req.body.minDepositAmount ? Number(req.body.minDepositAmount) : null
        };

        const result = await createProductUseCase.execute(dto);

        if (result instanceof Error) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(201).json(result);
    }

    async getAllProducts(req: Request, res: Response) {
        const getAllProductsUseCase = new GetAllSavingsProductsUseCase(this.savingsProductRepository);
        const activeOnly = req.query.activeOnly === 'true';
        
        const products = await getAllProductsUseCase.execute(activeOnly);
        return res.status(200).json(products);
    }

    async updateProduct(req: Request, res: Response) {
        const updateProductUseCase = new UpdateSavingsProductUseCase(
            this.savingsProductRepository,
            this.savingsAccountRepository
        );

        const dto: UpdateSavingsProduct = {
            productId: req.params.productId as string,
            ...(req.body.interestRate !== undefined && { interestRate: Number(req.body.interestRate) }),
            ...(req.body.maxDepositAmount !== undefined && { maxDepositAmount: req.body.maxDepositAmount === null ? null : Number(req.body.maxDepositAmount) }),
            ...(req.body.minDepositAmount !== undefined && { minDepositAmount: req.body.minDepositAmount === null ? null : Number(req.body.minDepositAmount) }),
            ...(req.body.isActive !== undefined && { isActive: Boolean(req.body.isActive) })
        };

        const result = await updateProductUseCase.execute(dto);

        if (result instanceof Error) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async subscribeToProduct(req: Request, res: Response) {
        const subscribeUseCase = new SubscribeToSavingsProductUseCase(
            this.savingsAccountRepository,
            this.savingsProductRepository,
            this.accountRepository
        );

        const userId = (req as any).user?.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const dto = {
            userId,
            productId: req.body.productId,
            ...(req.body.initialDeposit && { initialDeposit: Number(req.body.initialDeposit) })
        };

        const result = await subscribeUseCase.execute(dto);

        if (result instanceof Error) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(201).json(result);
    }
}
