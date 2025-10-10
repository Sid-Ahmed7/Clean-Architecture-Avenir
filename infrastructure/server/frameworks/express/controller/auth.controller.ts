import { Request, Response } from "express";
import {RegisterUseCase} from "../../../../../application/usecases/auth/RegisterUseCase";
import {LoginUseCase} from "../../../../../application/usecases/auth/LoginUseCase";
import {RefreshTokenUseCase} from "../../../../../application/usecases/auth/RefreshTokenUseCase";
import { GetUserByIdUseCase} from "../../../../../application/usecases/auth/GetUserByIdUseCase";
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

export class AuthController {

      constructor(
        private readonly userRepository: InMemoryUserRepository,
        private readonly roleRepository: InMemoryRoleRepository,
        private readonly userRoleRepository: InMemoryUserRoleRepository,
        private readonly tokenService: TokenService,
        private readonly passwordService: PasswordService,
        private readonly emailService: EmailService,
        private readonly registrationTokenGeneratorService: RegistrationTokenGeneratorService
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

        return res.status(200).json({
          accessToken: result.accessToken,
          user: result.user,
          roles: result.roles
        });
      }


      async getUserProfile(req: Request, res: Response) {
        const getUseridUseCase = new GetUserByIdUseCase(this.userRepository);

        const userId = req.user?.userId;
        
        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await getUseridUseCase.execute(userId);

        if(user instanceof Error) {
          if(user instanceof UserNotFoundError) {
            return res.status(404).json({ error: user.message });
          }
          return res.status(500).json({ error: user.message });
        }

        return res.status(200).json({ user });
      }
      async logout (req: Request, res: Response) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logged out successfully" });
      }
   


      

}