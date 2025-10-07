import { Request, Response } from "express";
import { RegisterUseCase } from "../../application/usecases/auth/RegisterUseCase";
import { LoginUseCase } from "../../application/usecases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../../application/usecases/auth/RefreshTokenUseCase";
import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { UserRoleRepository } from "../repositories/UserRoleRepository";
import { TokenRepository } from "../repositories/TokenRepository";
import { RoleEnum } from "../../domain/enums/RoleEnum";

export class AuthController {
  private registerUseCase: RegisterUseCase;
  private loginUseCase: LoginUseCase;
  private refreshTokenUseCase: RefreshTokenUseCase;

  constructor() {
    const userRepository = new UserRepository();
    const roleRepository = new RoleRepository();
    const userRoleRepository = new UserRoleRepository();
    const tokenRepository = new TokenRepository();

    this.registerUseCase = new RegisterUseCase(
      userRepository,
      roleRepository,
      userRoleRepository
    );

    this.loginUseCase = new LoginUseCase(
      userRepository,
      userRoleRepository,
      tokenRepository
    );

    this.refreshTokenUseCase = new RefreshTokenUseCase(
      tokenRepository,
      userRoleRepository,
      userRepository
    );
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, phoneNumber, dateOfBirth, address } = req.body;

      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const result = await this.registerUseCase.execute(
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth ? new Date(dateOfBirth) : undefined,
        address
      );

      if (result instanceof Error) {
        res.status(400).json({ message: result.message });
        return;
      }

      // Don't return the user object directly to avoid exposing sensitive data
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: result.id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const result = await this.loginUseCase.execute(email, password);

      if (result instanceof Error) {
        res.status(401).json({ message: result.message });
        return;
      }

      // Check if user has BANK_MANAGER role for director login
      const isDirector = result.roles.includes(RoleEnum.BANK_MANAGER);

      // Set refresh token as HTTP-only cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Return access token and user info
      res.status(200).json({
        message: "Login successful",
        accessToken: result.accessToken,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          roles: result.roles,
          isDirector
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Clear the refresh token cookie
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
        return;
      }

      // Call the refresh token use case
      const result = await this.refreshTokenUseCase.execute(refreshToken);

      if (result instanceof Error) {
        res.status(401).json({ message: result.message });
        return;
      }

      // Check if user has BANK_MANAGER role for director login
      const isDirector = result.roles.includes(RoleEnum.BANK_MANAGER);

      // Return new access token and user info
      res.status(200).json({
        message: "Token refreshed successfully",
        accessToken: result.accessToken,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          roles: result.roles,
          isDirector
        }
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
