import { Request, Response } from "express";
import {RegisterUseCase} from "../../../../../application/usecases/auth/RegisterUseCase";
import {LoginUseCase} from "../../../../../application/usecases/auth/LoginUseCase";
import {RefreshTokenUseCase} from "../../../../../application/usecases/auth/RefreshTokenUseCase";
import { GetUserByIdUseCase} from "../../../../../application/usecases/auth/GetUserByIdUseCase";
import { GetUserRolesUseCase} from "../../../../../application/usecases/auth/GetUserRolesUseCase";
import {ConfirmRegistrationUseCase} from "../../../../../application/usecases/auth/ConfirmRegistrationUseCase";
import {CreateBankAdvisorUseCase} from "../../../../../application//usecases/auth/CreateBankAdvisorUseCase";
import {CreateBankManagerUseCase} from "../../../../../application//usecases/auth/CreateBankManagerUseCase";
import {CreateAdminUseCase} from "../../../../../application/usecases/auth/CreateAdminUseCase";
import { InMemoryUserRepository} from "../../../../adapters/repositories/InMemoryUserRepository";
import { InMemoryRoleRepository} from "../../../../adapters/repositories/InMemoryRoleRepository";
import { InMemoryUserRoleRepository} from "../../../../adapters/repositories/InMemoryUserRoleRepository";
import { UserAlreadyExistsError } from "../../../../../application/errors/UserAlreadyExistsError";
import { TokenService } from "../../../../../application/ports/services/auth/TokenService";
import { PasswordService } from "../../../../../application/ports/services/auth/PasswordService";
import { UserNotFoundError } from "../../../../../application/errors/UserNotFoundError";
import { InvalidEmailOrPasswordError } from "../../../../../application/errors/InvalidEmailOrPasswordError";
import { RoleNotFoundError } from "../../../../../application/errors/RoleNotFoundError";
import { BankUserEntity } from "../../../../../domain/entities/BankUserEntity";
import { UserStatusEnum } from "../../../../../domain/enums/UserStatusEnum";
import { EmailService } from "../../../../../application/ports/services/EmailService";
import { RegistrationTokenGeneratorService } from "../../../../../application/ports/services/auth/RegistrationTokenGeneratorService";
import { EventBusInterface } from "../../../../../application/ports/event/EventBusInterface";
import { TokenNotFoundError } from "../../../../../application/errors/TokenNotFoundError";
import { ExpiredTokenError } from "../../../../../application/errors/ExpiredTokenError";
import { EmailTemplateService } from "../../../../adapters/services/EmailTemplateService";
import { GetAllAdvisorUseCase } from "../../../../../application/usecases/auth/GetAllAdvisorUseCase";

export class AuthController {

      constructor(
        private readonly userRepository: InMemoryUserRepository,
        private readonly roleRepository: InMemoryRoleRepository,
        private readonly userRoleRepository: InMemoryUserRoleRepository,
        private readonly tokenService: TokenService,
        private readonly passwordService: PasswordService,
        private readonly emailService: EmailService,
        private readonly emailTemplateService: EmailTemplateService,
        private readonly registrationTokenGeneratorService: RegistrationTokenGeneratorService,
        private readonly eventBus: EventBusInterface
      ) {}


      async register(req: Request, res: Response) {
        const { email, password, firstName, lastName, phoneNumber, dateOfBirth, address } = req.body;

        const userOrError = BankUserEntity.from(
          email,
          password,
          UserStatusEnum.PENDING, 
          firstName,
          lastName,
          phoneNumber,
          new Date(dateOfBirth),
          address
        );

        if (userOrError instanceof Error) {
          return res.status(400).json({ error: userOrError.message });
        }

        const registerUseCase = new RegisterUseCase(
          this.userRepository,
          this.roleRepository,
          this.userRoleRepository,
          this.passwordService,
          this.emailService,
          this.emailTemplateService,
          this.registrationTokenGeneratorService
        );

        const result = await registerUseCase.execute(userOrError);
        if (result instanceof Error) {
          if (result instanceof UserAlreadyExistsError) {
            return res.status(409).json({ error: result.message });
          }
          return res.status(500).json({ error: result.message });
        }

        return res.status(201).json(result);
      }

      async registerAdvisor(req: Request, res: Response) {
        const { email, password, firstName, lastName, phoneNumber, dateOfBirth, address } = req.body;

        const userOrError = BankUserEntity.from(
          email,
          password,
          UserStatusEnum.PENDING, 
          firstName,
          lastName,
          phoneNumber,
          new Date(dateOfBirth),
          address
        );

        if (userOrError instanceof Error) {
          return res.status(400).json({ error: userOrError.message });
        }

        const createBankAdvisorUseCase = new  CreateBankAdvisorUseCase(
          this.userRepository,
          this.roleRepository,
          this.userRoleRepository,
          this.passwordService,
          this.emailService,
          this.emailTemplateService,
          this.registrationTokenGeneratorService
        );

        const result = await createBankAdvisorUseCase.execute(userOrError);
        if (result instanceof Error) {
          if (result instanceof UserAlreadyExistsError) {
            return res.status(409).json({ error: result.message });
          }
          return res.status(500).json({ error: result.message });
        }

        return res.status(201).json(result);
      }

      async confirmRegistration(req: Request, res: Response) {
        const confirmationUseCase = new ConfirmRegistrationUseCase(this.userRepository, this.emailService, this.eventBus);
        const { token } = req.query;

        if(!token || typeof token !== "string") {
          return res.status(400).json({error: "Token is required"});
        }

        const result = await confirmationUseCase.execute(token);

        if(result instanceof Error) {
          if (result instanceof TokenNotFoundError) {
            return res.status(404).json({error: result.message});
          }

          if(result instanceof ExpiredTokenError) {
            return res.status(400).json({error: result.message});
          }

          if(result instanceof UserNotFoundError) {
            return res.status(404).json({error: result.message});
          }
          return res.status(500).json({ error: result.message });
        }

        return res.status(200).json({ message: "Account successfully confirmed"});
      }


      async login(req: Request, res: Response) {
        const loginUseCase = new LoginUseCase(this.userRepository, this.userRoleRepository, this.tokenService, this.passwordService )
        const {email, password} = req.body;

        const result = await loginUseCase.execute(email, password);
        if(result instanceof Error) {
          if(result instanceof UserNotFoundError) {
            return res.status(404).json({ error: result.message });
          }

          if(result instanceof InvalidEmailOrPasswordError) {
            return res.status(401).json({ error: result.message });
          }

          if(result instanceof RoleNotFoundError) {
            return res.status(404).json({ error: result.message });
          }
          return res.status(500).json({ error: result.message });
        }

        res.cookie("accessToken", result.accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7 
        })

        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7 
        })

        return res.status(200).json({
          user: result.user,
        });
      }

      async refreshToken(req: Request, res: Response) {
        const refreshTokenUseCase = new RefreshTokenUseCase(this.tokenService, this.userRoleRepository, this.userRepository);
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
          return res.status(400).json({ error: "Refresh token is required" });
        }

        const result = await refreshTokenUseCase.execute(refreshToken);
        if(result instanceof Error) {

          if(result instanceof UserNotFoundError) {
            return res.status(404).json({ error: result.message });
          }

          if (result instanceof RoleNotFoundError) {
            return res.status(404).json({ error: result.message });
          }

          return res.status(500).json({ error: result.message });
        }

        res.cookie("accessToken", result.accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7 
        })

        return res.status(200).json({
          accessToken: result.accessToken,
          user: result.user,
          roles: result.roles
        });
      }


        async getUserProfile(req: Request, res: Response) {
        const userId = req.user?.userId;

        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const getUserUseCase = new GetUserByIdUseCase(this.userRepository);
        const getUserRolesUseCase = new GetUserRolesUseCase(this.userRoleRepository);

        const user = await getUserUseCase.execute(userId);
        if (user instanceof Error) {
          if (user instanceof UserNotFoundError) {
            return res.status(404).json({ error: user.message });
          }
          return res.status(500).json({ error: user.message });
        }


        const roles = await getUserRolesUseCase.execute(userId);
        const role = Array.isArray(roles) && roles.length > 0 ? roles[0]?.name : undefined;

        return res.status(200).json({
          user: {
            ...user,
            role, 
          },
        });
      }
        async getAdvisors(req: Request, res: Response) {
        const getClientConversationUseCase = new GetAllAdvisorUseCase(this.roleRepository, this.userRepository, this.userRoleRepository);

        const userId = req.user?.userId;
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await getClientConversationUseCase.execute();
        if(result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

      async logout (req: Request, res: Response) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logged out successfully" });
      }

      async registerManager(req: Request, res: Response) {
        const { email, password, firstName, lastName, phoneNumber, dateOfBirth, address } = req.body;

        const userOrError = BankUserEntity.from(
          email,
          password,
          UserStatusEnum.PENDING, 
          firstName,
          lastName,
          phoneNumber,
          new Date(dateOfBirth),
          address
        );

        if (userOrError instanceof Error) {
          return res.status(400).json({ error: userOrError.message });
        }

        const createBankManagerUseCase = new CreateBankManagerUseCase(
          this.userRepository,
          this.roleRepository,
          this.userRoleRepository,
          this.passwordService,
          this.emailService,
          this.emailTemplateService,
          this.registrationTokenGeneratorService
        );

        const result = await createBankManagerUseCase.execute(userOrError);
        if (result instanceof Error) {
          if (result instanceof UserAlreadyExistsError) {
            return res.status(409).json({ error: result.message });
          }
          return res.status(500).json({ error: result.message });
        }

        return res.status(201).json(result);
      }

      async createAdmin(req: Request, res: Response) {
        const adminPassword = req.headers['x-admin-password'] || req.body.adminPassword;

        if (adminPassword !== process.env.ADMIN_CREATION_PASSWORD) {
            return res.status(403).json({ error: "Forbidden: Invalid admin creation password" });
        }

        const { email, password, firstName, lastName, phoneNumber, dateOfBirth, address } = req.body;

        const userOrError = BankUserEntity.from(
            email,
            password,
            UserStatusEnum.ACTIVE,
            firstName,
            lastName,
            phoneNumber,
            new Date(dateOfBirth),
            address,
            true
        );

        if (userOrError instanceof Error) {
            return res.status(400).json({ error: userOrError.message });
        }

        const createAdminUseCase = new CreateAdminUseCase(
            this.userRepository,
            this.roleRepository,
            this.userRoleRepository,
            this.passwordService
        );

        const result = await createAdminUseCase.execute(userOrError);

        if (result instanceof Error) {
            if (result instanceof UserAlreadyExistsError) {
                return res.status(409).json({ error: result.message });
            }
            return res.status(500).json({ error: result.message });
        }

        return res.status(201).json(result);
      }
}
