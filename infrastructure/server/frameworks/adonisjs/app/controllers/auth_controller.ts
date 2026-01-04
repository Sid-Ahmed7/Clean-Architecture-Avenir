import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import type { EventBusInterface } from "#application/ports/event/EventBusInterface.js";
import type { RoleRepositoryInterface } from "#application/ports/repositories/auth/RoleRepositoryInterface.js";
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js";
import type { UserRoleRepositoryInterface } from "#application/ports/repositories/auth/UserRoleRepositoryInterface.js";
import type { PasswordEncryptionService } from "#infrastructure/adapters/services/auth/PasswordEncryptionService.js";
import type { RegistrationTokenService } from "#infrastructure/adapters/services/auth/RegistrationTokenService.js";
import type { JwtTokenService } from "#infrastructure/adapters/services/auth/JwtTokenService.js";
import type { ResendEmailService } from "#infrastructure/adapters/services/ResendEmailService.js";
import type { EmailTemplateService } from '#infrastructure/adapters/services/EmailTemplateService.js';
import type { LocaleValidationService } from '#infrastructure/adapters/services/LocaleValidationService.js';
import type { CryptoUuidGenerator } from '#infrastructure/adapters/services/CryptoUuidGenerator.js';
import { RegisterUseCase } from '#application/usecases/auth/RegisterUseCase.js';
import { LoginUseCase } from '#application/usecases/auth/LoginUseCase.js';
import { RefreshTokenUseCase } from '#application/usecases/auth/RefreshTokenUseCase.js';
import { GetUserByIdUseCase } from '#application/usecases/auth/GetUserByIdUseCase.js';
import { GetUserRolesUseCase } from '#application/usecases/auth/GetUserRolesUseCase.js';
import { ConfirmRegistrationUseCase } from '#application/usecases/auth/ConfirmRegistrationUseCase.js';
import { CreateBankAdvisorUseCase } from '#application/usecases/auth/CreateBankAdvisorUseCase.js';
import { CreateBankManagerUseCase } from '#application/usecases/auth/CreateBankManagerUseCase.js';
import { GetAllAdvisorUseCase } from '#application/usecases/auth/GetAllAdvisorUseCase.js';
import { UserAlreadyExistsError } from '#application/errors/UserAlreadyExistsError.js';
import { UserNotFoundError } from '#application/errors/UserNotFoundError.js';
import { InvalidEmailOrPasswordError } from '#application/errors/InvalidEmailOrPasswordError.js';
import { RoleNotFoundError } from '#application/errors/RoleNotFoundError.js';
import { TokenNotFoundError } from '#application/errors/TokenNotFoundError.js';
import { ExpiredTokenError } from '#application/errors/ExpiredTokenError.js';
import type { NotificationRepositoryInterface } from '#application/ports/repositories/notification/NotificationRepositoryInterface.js';
import type { NotificationService } from '#infrastructure/adapters/services/notification/NotificationService.js';
import { SendNotificationToClientUseCase } from '#application/usecases/notification/SendNotificationToClientUseCase.js';
import type { RolePriorityService } from '#infrastructure/adapters/services/RolePriorityService.js';
import {registerValidator,registerAdvisorValidator,loginValidator,registerManagerValidator} from '#infrastructure/server/frameworks/adonisjs/app/validators/auth.js';
import env from '#start/env.js';
import vine from '@vinejs/vine';
import { AuthContext } from '#types/JwtPayload';

@inject()
export default class AuthController {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly tokenService: JwtTokenService,
    private readonly passwordService: PasswordEncryptionService,
    private readonly emailService: ResendEmailService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly registrationTokenGeneratorService: RegistrationTokenService,
    private readonly localeService: LocaleValidationService,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly eventBus: EventBusInterface,
    private readonly rolePriorityService: RolePriorityService,
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly notificationService: NotificationService
  ) {}

  async register({ request, response }: HttpContext) {
    const registerUseCase = new RegisterUseCase(this.userRepository,this.roleRepository,this.userRoleRepository,this.passwordService,this.emailTemplateService,this.registrationTokenGeneratorService,this.localeService,this.uuidService);

    try {
      const input = await vine.validate({ schema: registerValidator, data: request.body() })
      const locale = request.input('locale') || 'en';

      const result = await registerUseCase.execute(input, locale);

      if (result instanceof Error) {
        if (result instanceof UserAlreadyExistsError) {
          return response.status(409).json({ error: result.message });
        }
        return response.status(500).json({ error: result.message });
      }

      return response.status(201).json(result);
    } catch (error) {
      if (error.messages) {
        return response.status(422).json({ errors: error.messages });
      }
      return response.status(422).json({ error: error.message || 'Validation failed' });
    }
  }

  async registerAdvisor({ request, response }: HttpContext) {
    const createBankAdvisorUseCase = new CreateBankAdvisorUseCase(
      this.userRepository,
      this.roleRepository,
      this.userRoleRepository,
      this.passwordService,
      this.emailTemplateService,
      this.registrationTokenGeneratorService,
      this.localeService,
      this.uuidService
    );

    const input = await vine.validate({ schema: registerAdvisorValidator, data: request.body() })
    const locale = request.input('locale') || 'en'; 

    const result = await createBankAdvisorUseCase.execute(input, locale);

    if (result instanceof Error) {
      if (result instanceof UserAlreadyExistsError) {
        return response.status(409).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async confirmRegistration({ request, response }: HttpContext) {
    const confirmationUseCase = new ConfirmRegistrationUseCase(
      this.userRepository,
      this.emailService,
      this.eventBus
    );
    const token = request.qs().token;

    if (!token || typeof token !== "string") {
      return response.status(400).json({ error: "Token is required" });
    }

    const result = await confirmationUseCase.execute(token);

    if (result instanceof Error) {
      if (result instanceof TokenNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      if (result instanceof ExpiredTokenError) {
        return response.status(400).json({ error: result.message });
      }

      if (result instanceof UserNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json({ message: "Account successfully confirmed" });
  }

  async login({ request, response }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );
    const loginUseCase = new LoginUseCase(
      this.userRepository,
      this.userRoleRepository,
      this.tokenService,
      this.passwordService,
      sendNotificationUseCase
    );

    const input = await vine.validate({ schema: loginValidator, data: request.body() })
    const result = await loginUseCase.execute(input.email, input.password);

    if (result instanceof Error) {
      if (result instanceof UserNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      if (result instanceof InvalidEmailOrPasswordError) {
        return response.status(401).json({ error: result.message });
      }

      if (result instanceof RoleNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    response.plainCookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    response.plainCookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return response.status(200).json({
      user: result.user,
      roles: result.roles
    });
  }

  async refreshToken({ request, response }: HttpContext) {
    const refreshTokenUseCase = new RefreshTokenUseCase(
      this.tokenService,
      this.userRoleRepository,
      this.userRepository
    );
    const refreshToken = request.cookie("refreshToken");

    if (!refreshToken) {
      return response.status(400).json({ error: "Refresh token is required" });
    }

    const result = await refreshTokenUseCase.execute(refreshToken);
    if (result instanceof Error) {
      if (result instanceof UserNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      if (result instanceof RoleNotFoundError) {
        return response.status(404).json({ error: result.message });
      }

      return response.status(500).json({ error: result.message });
    }

    response.plainCookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return response.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
      roles: result.roles
    });
  }

  async getUserProfile({ response, auth }: HttpContext) {
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const getUserUseCase = new GetUserByIdUseCase(this.userRepository);
    const getUserRolesUseCase = new GetUserRolesUseCase(this.userRoleRepository);

    const user = await getUserUseCase.execute(userId);
    if (user instanceof Error) {
      if (user instanceof UserNotFoundError) {
        return response.status(404).json({ error: user.message });
      }
      return response.status(500).json({ error: user.message });
    }

    const roles = await getUserRolesUseCase.execute(userId);

    const roleNames = Array.isArray(roles) ? roles.map(r => r.name) : [];
    const role = this.rolePriorityService.getHighestPriorityRole(roleNames);

    return response.status(200).json({
      user: {
        ...user,
        role,
      },
    });
  }

  async getAdvisors({ response, auth }: HttpContext) {
    const getClientConversationUseCase = new GetAllAdvisorUseCase(
      this.roleRepository,
      this.userRepository,
      this.userRoleRepository
    );

    const userId = auth?.userId;
    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const result = await getClientConversationUseCase.execute();
    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async logout({ response }: HttpContext) {
    response.clearCookie("accessToken");
    response.clearCookie("refreshToken");
    return response.status(200).json({ message: "Logged out successfully" });
  }

  async registerManager({ request, response }: HttpContext) {
    const createBankManagerUseCase = new CreateBankManagerUseCase(
      this.userRepository,
      this.roleRepository,
      this.userRoleRepository,
      this.passwordService,
      this.emailTemplateService,
      this.registrationTokenGeneratorService,
      this.localeService,
      this.uuidService
    );

    const secretCode = request.input('secretCode');

    if (!secretCode || secretCode !== env.get('MANAGER_CREATION_PASSWORD')) {
      return response.status(403).json({ error: "Invalid secret code. You are not authorized to create a manager." });
    }

    const input = await vine.validate({ schema: registerManagerValidator, data: request.body() })
    const locale = request.input('locale') || 'en';

    const result = await createBankManagerUseCase.execute(input, locale);

    if (result instanceof Error) {
      if (result instanceof UserAlreadyExistsError) {
        return response.status(409).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
