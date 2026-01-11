import { Request, Response } from "express";
import { GetAllAdvisorUseCase } from "../../../../../application/usecases/auth/GetAllAdvisorUseCase";
import { GetAllClientsUseCase } from "../../../../../application/usecases/auth/GetAllClientsUseCase";
import { UpdateUserUseCase } from "../../../../../application/usecases/auth/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../../../../application/usecases/auth/DeleteUserUseCase";
import { GetUserByIdUseCase } from "../../../../../application/usecases/auth/GetUserByIdUseCase";
import { BanUserUseCase } from "../../../../../application/usecases/user-management/BanUserUseCase";
import { UserNotFoundError } from "../../../../../application/errors/UserNotFoundError";
import { BankUserEntity } from "../../../../../domain/entities/BankUserEntity";
import { UserStatusEnum } from "../../../../../domain/enums/UserStatusEnum";
import { updateUserSchema } from "../schemas/auth/updateUserSchema";
import { UserRepositoryInterface } from "../../../../../application/ports/repositories/auth/UserRepositoryInterface";
import { RoleRepositoryInterface } from "../../../../../application/ports/repositories/auth/RoleRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../../../../application/ports/repositories/auth/UserRoleRepositoryInterface";
import { AccountRepositoryInterface } from "../../../../../application/ports/repositories/AccountRepositoryInterface";
import { SavingsAccountRepositoryInterface } from "../../../../../application/ports/repositories/SavingsAccountRepositoryInterface";
import { NotificationRepositoryInterface } from "../../../../../application/ports/repositories/notification/NotificationRepositoryInterface";
import { NotificationService } from "../../../../adapters/services/notification/NotificationService";
import { CryptoUuidGenerator } from "../../../../adapters/services/CryptoUuidGenerator";
import { SendNotificationToClientUseCase } from "../../../../../application/usecases/notification/SendNotificationToClientUseCase";
import { UserNoBanError } from "#application/errors/UserNoBanError";
import { UserAlreadyBanError } from "#application/errors/UserAlreadyBanError";
import { error } from "console";
import { UnbanUserUseCase } from "#application/usecases/user-management/UnbanUserUseCase";

export class UserManagementController {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly roleRepository: RoleRepositoryInterface,
        private readonly userRoleRepository: UserRoleRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly savingsAccountRepository: SavingsAccountRepositoryInterface,
        private readonly notificationRepository: NotificationRepositoryInterface,
        private readonly notificationService: NotificationService,
        private readonly uuidService: CryptoUuidGenerator
    ) {}

    private mapUserToDTO(user: BankUserEntity) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            status: user.status,
            isRegistered: user.isRegistered,
            createdAt: user.createdAt
        };
    }

    async getAllUsers(req: Request, res: Response) {
        const users = await this.userRepository.findAll();
        
        const usersWithRoles = await Promise.all(
            users.map(async (user) => {
                const roles = await this.userRoleRepository.findRolesByUserId(user.id);
                return {
                    ...this.mapUserToDTO(user),
                    roles: Array.isArray(roles) ? roles.map(r => r.name) : []
                };
            })
        );

        return res.status(200).json(usersWithRoles);
    }

    async getClientUsers(req: Request, res: Response) {
        const getAllClientsUseCase = new GetAllClientsUseCase(
            this.roleRepository,
            this.userRepository,
            this.userRoleRepository
        );

        const result = await getAllClientsUseCase.execute();
        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        const clients = result.map(user => this.mapUserToDTO(user));

        return res.status(200).json(clients);
    }

    async getAdvisorUsers(req: Request, res: Response) {
        const getAllAdvisorsUseCase = new GetAllAdvisorUseCase(
            this.roleRepository,
            this.userRepository,
            this.userRoleRepository
        );

        const result = await getAllAdvisorsUseCase.execute();
        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        const advisors = result.map(user => this.mapUserToDTO(user));

        return res.status(200).json(advisors);
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const parseResult = updateUserSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const getUserUseCase = new GetUserByIdUseCase(this.userRepository);
        const existingUser = await getUserUseCase.execute(id);

        if (existingUser instanceof Error) {
            if (existingUser instanceof UserNotFoundError) {
                return res.status(404).json({ error: existingUser.message });
            }
            return res.status(500).json({ error: existingUser.message });
        }

        const updatedUserData = BankUserEntity.from(
            existingUser.id,
            parseResult.data.email ?? existingUser.email,
            existingUser.password, 
            (parseResult.data.status as UserStatusEnum) ?? existingUser.status,
            parseResult.data.firstName ?? existingUser.firstName,
            parseResult.data.lastName ?? existingUser.lastName,
            parseResult.data.phoneNumber ?? existingUser.phoneNumber,
            existingUser.dateOfBirth,
            parseResult.data.address ?? existingUser.address,
            existingUser.isRegistered,
            existingUser.confirmationToken,
            existingUser.confirmationTokenExpiresAt,
            existingUser.resetPasswordToken,
            existingUser.resetTokenExpiresAt,
            existingUser.createdAt
        );

        if (updatedUserData instanceof Error) {
            return res.status(400).json({ error: updatedUserData.message });
        }

        const sendNotificationUseCase = new SendNotificationToClientUseCase(
            this.notificationRepository,
            this.notificationService,
            this.uuidService,
            this.userRepository
        );

        const updateUserUseCase = new UpdateUserUseCase(this.userRepository, sendNotificationUseCase);
        const result = await updateUserUseCase.execute(updatedUserData);

        if (result instanceof UserNotFoundError) {
            return res.status(404).json({ error: result.message });
        }
        
        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(this.mapUserToDTO(result));
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const deleteUserUseCase = new DeleteUserUseCase(
            this.userRepository,
            this.accountRepository,
            this.savingsAccountRepository
        );

        const result = await deleteUserUseCase.execute(id);

        if (result instanceof UserNotFoundError) {
            return res.status(404).json({ error: result.message });
        }
        
        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async banUser(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const banUserUseCase = new BanUserUseCase(this.userRepository);
        const result = await banUserUseCase.execute(id);
        if (result instanceof Error) {
            if (result instanceof UserNotFoundError) {
                return res.status(404).json({ error: result.message });
            }

            if (result instanceof UserAlreadyBanError) {
                return res.status(409).json({ error: result.message });
            }
            return res.status(500).json({ error: result.message });

        }
        return res.status(200).json({ message: "User banned successfully" });
    }

    async unbanUser(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const unbanUserUseCase = new UnbanUserUseCase(this.userRepository);

        const result = await unbanUserUseCase.execute(id);
        if( result instanceof Error) {
            if (result instanceof UserNotFoundError) {
                return res.status(404).json({ error: result.message });
            }
            if (result instanceof UserNoBanError) {
                return res.status(409).json({ error: result.message });
            }
            return res.status(500).json({ error: result.message });
        }
        return res.status(200).json({ message: "User unbanned successfully" });
    }
}
