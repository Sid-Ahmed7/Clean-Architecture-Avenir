import { Request, Response } from "express";
import { CreateBeneficiaryGroupUseCase } from "../../../../../application/usecases/beneficiaries/groups/CreateBeneficiaryGroupUseCase";
import { GetGroupsByUserUseCase } from "../../../../../application/usecases/beneficiaries/groups/GetGroupsByUserUseCase";
import { AddBeneficiaryToGroupUseCase } from "../../../../../application/usecases/beneficiaries/groups/AddBeneficiaryToGroupUseCase";
import { RemoveBeneficiaryFromGroupUseCase } from "../../../../../application/usecases/beneficiaries/groups/RemoveBeneficiaryFromGroupUseCase";
import { DeleteBeneficiaryGroupUseCase } from "../../../../../application/usecases/beneficiaries/groups/DeleteBeneficiaryGroupUseCase";
import { UpdateBeneficiaryGroupUseCase } from "../../../../../application/usecases/beneficiaries/groups/UpdateBeneficiaryGroupUseCase";
import { TransferToGroupUseCase } from "../../../../../application/usecases/transfer/TransferToGroupUseCase";
import { BeneficiaryGroupRepositoryInterface } from "../../../../../application/ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";
import { BeneficiaryRepositoryInterface } from "../../../../../application/ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { AccountRepositoryInterface } from "../../../../../application/ports/repositories/AccountRepositoryInterface";
import { TransactionRepositoryInterface } from "../../../../../application/ports/repositories/TransactionRepositoryInterface";
import { UserRepositoryInterface } from "../../../../../application/ports/repositories/auth/UserRepositoryInterface";
import { NotificationRepositoryInterface } from "../../../../../application/ports/repositories/notification/NotificationRepositoryInterface";
import { UuidGeneratorService } from "../../../../../application/ports/services/UuidGeneratorService";
import { BeneficiaryGroupAlreadyExistsError } from "../../../../../application/errors/BeneficiaryGroupAlreadyExistsError";
import { BeneficiaryGroupNotFoundError } from "../../../../../application/errors/BeneficiaryGroupNotFoundError";
import { BeneficiaryNotFoundError } from "../../../../../application/errors/BeneficiaryNotFoundError";
import { AccountNotFoundError } from "../../../../../application/errors/AccountNotFoundError";
import { InsufficientFundsError } from "../../../../../application/errors/InsufficientFundsError";
import { UnauthorizedAccessError } from "../../../../../application/errors/UnauthorizedAccessError";
import { CreateBeneficiaryGroup } from "../../../../../application/requests/CreateBeneficiaryGroup";
import { UpdateBeneficiaryGroup } from "../../../../../application/requests/UpdateBeneficiaryGroup";
import { TransferToGroup } from "../../../../../application/requests/TransferToGroup";
import { createBeneficiaryGroupSchema } from "../schemas/beneficiaries/createBeneficiaryGroupSchema";
import { updateBeneficiaryGroupSchema } from "../schemas/beneficiaries/updateBeneficiaryGroupSchema";
import { addBeneficiaryToGroupSchema } from "../schemas/beneficiaries/addBeneficiaryToGroupSchema";
import { transferToGroupSchema } from "../schemas/accounts/transferToGroupSchema";
import { SendNotificationToClientUseCase } from "../../../../../application/usecases/notification/SendNotificationToClientUseCase";
import { NotificationService } from "../../../../adapters/services/notification/NotificationService";

export class BeneficiaryGroupController {
    constructor(
        private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface,
        private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
        private readonly uuidService: UuidGeneratorService,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly transactionRepository: TransactionRepositoryInterface,
        private readonly notificationRepository: NotificationRepositoryInterface,
        private readonly notificationPublisher: NotificationService,
        private readonly userRepository: UserRepositoryInterface,

    ) {}

    async createBeneficiaryGroup(req: Request, res: Response) {
        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const createBeneficiaryGroupUseCase = new CreateBeneficiaryGroupUseCase(this.beneficiaryGroupRepository,this.uuidService, sendNotificationUseCase);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const parseResult = createBeneficiaryGroupSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const groupData: CreateBeneficiaryGroup = {userId,groupName: parseResult.data.groupName,beneficiaryIds: parseResult.data.beneficiaryIds};

        const result = await createBeneficiaryGroupUseCase.execute(groupData);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryGroupAlreadyExistsError) {
                return res.status(409).json({ error: result.message });
            }

            return res.status(500).json({ error: result.message });
        }

        return res.status(201).json(result);
    }

    async getGroupsByUser(req: Request, res: Response) {
        const getGroupsByUserUseCase = new GetGroupsByUserUseCase(this.beneficiaryGroupRepository);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const result = await getGroupsByUserUseCase.execute(userId);

        return res.status(200).json(result);
    }

    async addBeneficiaryToGroup(req: Request, res: Response) {
        const addBeneficiaryToGroupUseCase = new AddBeneficiaryToGroupUseCase(this.beneficiaryGroupRepository,this.beneficiaryRepository);

        const groupId = req.params.groupId;
        if (!groupId) {
            return res.status(400).json({ error: "Beneficiaries Group Id must be provided" });
        }

        const parseResult = addBeneficiaryToGroupSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const result = await addBeneficiaryToGroupUseCase.execute(groupId as string, parseResult.data.beneficiaryId);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryGroupNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            if (result instanceof BeneficiaryNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async removeBeneficiaryFromGroup(req: Request, res: Response) {
        const removeBeneficiaryFromGroupUseCase = new RemoveBeneficiaryFromGroupUseCase(this.beneficiaryGroupRepository);

        const groupId = req.params.groupId;
        const beneficiaryId = req.params.beneficiaryId;

        if (!groupId) {
            return res.status(400).json({ error: "Beneficiaries Group Id must be provided" });
        }
        
        if (!beneficiaryId) {
            return res.status(400).json({ error: "Beneficiary Id must be provided" });
        }

        const result = await removeBeneficiaryFromGroupUseCase.execute(groupId as string, beneficiaryId as string);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryGroupNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async updateBeneficiaryGroup(req: Request, res: Response) {
          const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        
        const updateBeneficiaryGroupUseCase = new UpdateBeneficiaryGroupUseCase(this.beneficiaryGroupRepository,sendNotificationUseCase);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const groupId = req.params.groupId;

        if (!groupId) {
            return res.status(400).json({ error: "Beneficiaries Group Id must be provided" });
        }

        const parseResult = updateBeneficiaryGroupSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const updateData: UpdateBeneficiaryGroup = {
            groupId: groupId as string,
            userId,
            ...(parseResult.data.groupName !== undefined && { groupName: parseResult.data.groupName }),
            ...(parseResult.data.beneficiaryIds !== undefined && { beneficiaryIds: parseResult.data.beneficiaryIds }),
        };

        const result = await updateBeneficiaryGroupUseCase.execute(updateData);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryGroupNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async deleteBeneficiaryGroup(req: Request, res: Response) {
          const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationPublisher,
            this.uuidService,
            this.userRepository
        );
        const deleteBeneficiaryGroupUseCase = new DeleteBeneficiaryGroupUseCase(this.beneficiaryGroupRepository, sendNotificationUseCase);

        const groupId = req.params.groupId;

        if (!groupId) {
            return res.status(400).json({ error: "Beneficiaries Group Id must be provided" });
        }

        const result = await deleteBeneficiaryGroupUseCase.execute(groupId as string);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryGroupNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json({ message: "Beneficiary group deleted successfully" });
    }

    async transferToGroup(req: Request, res: Response) {
        if (!this.accountRepository || !this.transactionRepository) {
            return res.status(500).json({ error: "Account or transaction repository not configured" });
        }

        const transferToGroupUseCase = new TransferToGroupUseCase(this.beneficiaryGroupRepository,this.beneficiaryRepository,this.accountRepository,this.transactionRepository,this.uuidService);

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const parseResult = transferToGroupSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const transferData: TransferToGroup = {
            userId,
            groupId: parseResult.data.groupId,
            sourceAccountNumber: parseResult.data.sourceAccountNumber,
            amountPerBeneficiary: parseResult.data.amountPerBeneficiary,
        };

        const result = await transferToGroupUseCase.execute(transferData);

        if (result instanceof Error) {
            if (result instanceof BeneficiaryGroupNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

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
