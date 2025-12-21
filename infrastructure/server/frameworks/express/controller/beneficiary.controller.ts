import { Request, Response } from "express";
import { CreateBeneficiaryUseCase } from "../../../../../application/usecases/beneficiaries/CreateBeneficiaryUseCase";
import { GetBeneficiariesByUserUseCase } from "../../../../../application/usecases/beneficiaries/GetBeneficiariesByUserUseCase";
import { UpdateBeneficiaryUseCase } from "../../../../../application/usecases/beneficiaries/UpdateBeneficiaryUseCase";
import { DeleteBeneficiaryUseCase } from "../../../../../application/usecases/beneficiaries/DeleteBeneficiaryUseCase";
import { TransferToBeneficiaryUseCase } from "../../../../../application/usecases/transfer/TransferToBeneficiaryUseCase";
import { InMemoryBeneficiaryRepository } from "../../../../adapters/repositories/InMemoryBeneficiaryRepository";
import { InMemoryAccountRepository } from "../../../../adapters/repositories/InMemoryAccountRepository";
import { InMemoryTransactionRepository } from "../../../../adapters/repositories/InMemoryTransactionRepository";
import { CryptoUuidGenerator } from "../../../../adapters/services/CryptoUuidGenerator";
import { BeneficiaryAlreadyExistsError } from "../../../../../application/errors/BeneficiaryAlreadyExistsError";
import { BeneficiaryNotFoundError } from "../../../../../application/errors/BeneficiaryNotFoundError";
import { IbanNotFoundError } from "../../../../../application/errors/IbanNotFoundError";
import { AccountNotFoundError } from "../../../../../application/errors/AccountNotFoundError";
import { InsufficientFundsError } from "../../../../../application/errors/InsufficientFundsError";
import { UnauthorizedAccessError } from "../../../../../application/errors/UnauthorizedAccessError";
import { CreateBeneficiary } from "../../../../../application/requests/CreateBeneficiary";
import { TransferToBeneficiary } from "../../../../../application/requests/TransferToBeneficiary";
import { createBeneficiarySchema } from "../schemas/beneficiaries/createBeneficiarySchema";
import { updateBeneficiarySchema } from "../schemas/beneficiaries/updateBeneficiarySchema";
import { transferToBeneficiarySchema } from "../schemas/accounts/transferToBeneficiarySchema";
import { UpdateBeneficiary } from "../../../../../application/requests/UpdateBeneficiary";

export class BeneficiaryController {
    constructor(
        private readonly beneficiaryRepository: InMemoryBeneficiaryRepository,
        private readonly accountRepository: InMemoryAccountRepository,
        private readonly uuidService: CryptoUuidGenerator,
        private readonly transactionRepository?: InMemoryTransactionRepository
    ) {}

    async createBeneficiary(req: Request, res: Response) {
        const createBeneficiaryUseCase = new CreateBeneficiaryUseCase(this.beneficiaryRepository,this.accountRepository,this.uuidService);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const parseResult = createBeneficiarySchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const beneficiaryData: CreateBeneficiary = {
            userId,
            iban: parseResult.data.iban,
            beneficiaryName: parseResult.data.beneficiaryName,
            ...(parseResult.data.email && { email: parseResult.data.email }),
            ...(parseResult.data.country && { country: parseResult.data.country }),
            ...(parseResult.data.address && { address: parseResult.data.address }),
        };

        const result = await createBeneficiaryUseCase.execute(beneficiaryData);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryAlreadyExistsError) {
                return res.status(409).json({ error: result.message });
            }

            if (result instanceof IbanNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            return res.status(500).json({ error: result.message });
        }

        return res.status(201).json(result);
    }

    async getBeneficiariesByUser(req: Request, res: Response) {
        const getBeneficiariesUseCase = new GetBeneficiariesByUserUseCase(this.beneficiaryRepository);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const result = await getBeneficiariesUseCase.execute(userId);
        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }
        
        return res.status(200).json(result);
    }

    async updateBeneficiary(req: Request, res: Response) {
        const updateBeneficiaryUseCase = new UpdateBeneficiaryUseCase(this.beneficiaryRepository);

        const beneficiaryId = req.params.beneficiaryId;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        if (!beneficiaryId) {
            return res.status(400).json({ error: "Beneficiary Id must be provided" });
        }

        const parseResult = updateBeneficiarySchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }
        const payload: UpdateBeneficiary = {
            beneficiaryId,
            userId,
            ...(parseResult.data.beneficiaryName && { beneficiaryName: parseResult.data.beneficiaryName }),
            ...(parseResult.data.email && { email: parseResult.data.email }),
            ...(parseResult.data.country && { country: parseResult.data.country }),
            ...(parseResult.data.address && { address: parseResult.data.address }),
        };
        const result = await updateBeneficiaryUseCase.execute(payload);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async deleteBeneficiary(req: Request, res: Response) {
        const deleteBeneficiaryUseCase = new DeleteBeneficiaryUseCase(this.beneficiaryRepository);

        const beneficiaryId = req.params.beneficiaryId;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        
        if (!beneficiaryId) {
            return res.status(400).json({ error: "Beneficiary Id must be provided" });
        }
        const result = await deleteBeneficiaryUseCase.execute(beneficiaryId, userId);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json({ message: "Beneficiary deleted successfully" });
    }

    async transferToBeneficiary(req: Request, res: Response) {
        if (!this.transactionRepository) {
            return res.status(500).json({ error: "Transaction repository not configured" });
        }

        const transferToBeneficiaryUseCase = new TransferToBeneficiaryUseCase(this.beneficiaryRepository,this.accountRepository,this.transactionRepository,this.uuidService);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const parseResult = transferToBeneficiarySchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const transferData: TransferToBeneficiary = {
            userId,
            beneficiaryId: parseResult.data.beneficiaryId,
            sourceAccountNumber: parseResult.data.sourceAccountNumber,
            amount: parseResult.data.amount,
        };

        const result = await transferToBeneficiaryUseCase.execute(transferData);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            if (result instanceof AccountNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            if (result instanceof InsufficientFundsError) {
                return res.status(400).json({ error: result.message });
            }

            if (result instanceof UnauthorizedAccessError) {
                return res.status(403).json({ error: result.message });
            }

            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }
}
