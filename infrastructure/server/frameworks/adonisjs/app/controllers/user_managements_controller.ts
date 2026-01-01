import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { GetAllAdvisorUseCase } from "#application/usecases/auth/GetAllAdvisorUseCase.js";
import { GetAllClientsUseCase } from "#application/usecases/auth/GetAllClientsUseCase.js";
import { GetUserByIdUseCase } from "#application/usecases/auth/GetUserByIdUseCase.js";
import { UpdateUserUseCase } from "#application/usecases/auth/UpdateUserUseCase.js";
import { DeleteUserUseCase } from "#application/usecases/auth/DeleteUserUseCase.js";
import { SendNotificationToClientUseCase } from "#application/usecases/notification/SendNotificationToClientUseCase.js";
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js";
import type { UserRoleRepositoryInterface } from "#application/ports/repositories/auth/UserRoleRepositoryInterface.js";
import type { RoleRepositoryInterface } from "#application/ports/repositories/auth/RoleRepositoryInterface.js";
import type { AccountRepositoryInterface } from "#application/ports/repositories/AccountRepositoryInterface.js";
import type { SavingsAccountRepositoryInterface } from "#application/ports/repositories/SavingsAccountRepositoryInterface.js";
import type { NotificationRepositoryInterface } from "#application/ports/repositories/notification/NotificationRepositoryInterface.js";
import type { NotificationService } from "#infrastructure/adapters/services/notification/NotificationService.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import { UserNotFoundError } from "#application/errors/UserNotFoundError.js";
import { BankUserEntity } from "#domain/entities/BankUserEntity.js";
import { UserStatusEnum } from "#domain/enums/UserStatusEnum.js";
import { AuthContext } from '#types/JwtPayload.js';
import vine from '@vinejs/vine';
import * as userManagementValidator from "#validators/user_management.js";

@inject()
export default class UserManagementsController {
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

  async getAllUsers({ response }: HttpContext) {
    const users = await this.userRepository.findAll();

    if (users instanceof Error) {
      return response.status(500).json({ error: users.message });
    }

    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const roles = await this.userRoleRepository.findRolesByUserId(user.id);
        return {
          ...this.mapUserToDTO(user),
          roles: Array.isArray(roles) && !(roles instanceof Error) ? roles.map(r => r.name) : []
        };
      })
    );

    return response.status(200).json(usersWithRoles);
  }

  async getClientUsers({ response }: HttpContext) {
    const getAllClientsUseCase = new GetAllClientsUseCase(
      this.roleRepository,
      this.userRepository,
      this.userRoleRepository
    );

    const result = await getAllClientsUseCase.execute();
    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    const clients = result.map(user => this.mapUserToDTO(user));

    return response.status(200).json(clients);
  }

  async getAdvisorUsers({ response }: HttpContext) {
    const getAllAdvisorsUseCase = new GetAllAdvisorUseCase(
      this.roleRepository,
      this.userRepository,
      this.userRoleRepository
    );

    const result = await getAllAdvisorsUseCase.execute();
    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    const advisors = result.map(user => this.mapUserToDTO(user));

    return response.status(200).json(advisors);
  }

  async updateUser({ request, response }: HttpContext) {
    const id = request.param('id');

    if (!id) {
      return response.status(400).json({ error: "User ID is required" });
    }

    const input = await vine.validate({schema: userManagementValidator.updateUserValidator, data: request.body()});

    const getUserUseCase = new GetUserByIdUseCase(this.userRepository);
    const existingUser = await getUserUseCase.execute(id);

    if (existingUser instanceof Error) {
      if (existingUser instanceof UserNotFoundError) {
        return response.status(404).json({ error: existingUser.message });
      }
      return response.status(500).json({ error: existingUser.message });
    }

    const updatedUserData = BankUserEntity.from(
      existingUser.id,
      input.email ?? existingUser.email,
      existingUser.password,
      (input.status as UserStatusEnum) ?? existingUser.status,
      input.firstName ?? existingUser.firstName,
      input.lastName ?? existingUser.lastName,
      input.phoneNumber ?? existingUser.phoneNumber,
      existingUser.dateOfBirth,
      input.address ?? existingUser.address,
      existingUser.isRegistered,
      existingUser.confirmationToken,
      existingUser.confirmationTokenExpiresAt,
      existingUser.resetPasswordToken,
      existingUser.resetTokenExpiresAt,
      existingUser.createdAt
    );

    if (updatedUserData instanceof Error) {
      return response.status(400).json({ error: updatedUserData.message });
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
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(this.mapUserToDTO(result));
  }

  async deleteUser({ request, response }: HttpContext) {
    const id = request.param('id');

    if (!id) {
      return response.status(400).json({ error: "User ID is required" });
    }

    const deleteUserUseCase = new DeleteUserUseCase(
      this.userRepository,
      this.accountRepository,
      this.savingsAccountRepository
    );

    const result = await deleteUserUseCase.execute(id);

    if (result instanceof UserNotFoundError) {
      return response.status(404).json({ error: result.message });
    }

    if (result instanceof Error) {
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
