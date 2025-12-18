import { Request, Response } from "express";
import { GetAllAdvisorUseCase } from "../../../../../application/usecases/auth/GetAllAdvisorUseCase";
import { GetAllClientsUseCase } from "../../../../../application/usecases/auth/GetAllClientsUseCase";
import { UpdateUserUseCase } from "../../../../../application/usecases/auth/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../../../../application/usecases/auth/DeleteUserUseCase";
import { GetUserByIdUseCase } from "../../../../../application/usecases/auth/GetUserByIdUseCase";
import { InMemoryUserRepository } from "../../../../adapters/repositories/InMemoryUserRepository";
import { InMemoryRoleRepository } from "../../../../adapters/repositories/InMemoryRoleRepository";
import { InMemoryUserRoleRepository } from "../../../../adapters/repositories/InMemoryUserRoleRepository";
import { InMemoryAccountRepository } from "../../../../adapters/repositories/InMemoryAccountRepository";
import { InMemorySavingsAccountRepository } from "../../../../adapters/repositories/InMemorySavingsAccountRepository";
import { UserNotFoundError } from "../../../../../application/errors/UserNotFoundError";
import { BankUserEntity } from "../../../../../domain/entities/BankUserEntity";
import { UserStatusEnum } from "../../../../../domain/enums/UserStatusEnum";
import { updateUserSchema } from "../schemas/auth/updateUserSchema";

export class UserManagementController {
    constructor(
        private readonly userRepository: InMemoryUserRepository,
        private readonly roleRepository: InMemoryRoleRepository,
        private readonly userRoleRepository: InMemoryUserRoleRepository,
        private readonly accountRepository: InMemoryAccountRepository,
        private readonly savingsAccountRepository: InMemorySavingsAccountRepository
    ) {}

    async getAllUsers(req: Request, res: Response) {
        const users = await this.userRepository.findAll();
        
        // Get roles for each user
        const usersWithRoles = await Promise.all(
            users.map(async (user) => {
                const roles = await this.userRoleRepository.findRolesByUserId(user.id);
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
                    createdAt: user.createdAt,
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

        // Remove sensitive data (password)
        const clients = result.map(user => ({
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
        }));

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

        // Remove sensitive data (password)
        const advisors = result.map(user => ({
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
        }));

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

        // Get existing user
        const getUserUseCase = new GetUserByIdUseCase(this.userRepository);
        const existingUser = await getUserUseCase.execute(id);

        if (existingUser instanceof Error) {
            if (existingUser instanceof UserNotFoundError) {
                return res.status(404).json({ error: existingUser.message });
            }
            return res.status(500).json({ error: existingUser.message });
        }

        // Create updated user entity
        const updatedUserData = BankUserEntity.from(
            existingUser.id,
            parseResult.data.email ?? existingUser.email,
            existingUser.password, // Keep existing password
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

        const updateUserUseCase = new UpdateUserUseCase(this.userRepository);
        const result = await updateUserUseCase.execute(updatedUserData);

        if (result instanceof UserNotFoundError) {
            return res.status(404).json({ error: result.message });
        }
        
        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json({
            id: result.id,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            phoneNumber: result.phoneNumber,
            dateOfBirth: result.dateOfBirth,
            address: result.address,
            status: result.status,
            isRegistered: result.isRegistered,
            createdAt: result.createdAt
        });
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
}
