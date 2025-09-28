import { RefreshTokenEntity } from "../../domain/entities/RefreshTokenEntity";
import { ITokenRepository } from "../../application/usecases/auth/LoginUseCase";
import { RoleEnum } from "../../domain/enums/RoleEnum";
import * as jwt from "jsonwebtoken";

// This is a mock in-memory repository for demonstration purposes
// In a real application, this would connect to a database
export class TokenRepository implements ITokenRepository {
  private refreshTokens: RefreshTokenEntity[] = [];
  private readonly JWT_SECRET = "your-secret-key"; // In production, use environment variables
  private readonly ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7; // 7 days

  generateAccessToken(userId: string, roles: RoleEnum[]): string {
    const payload = {
      sub: userId,
      roles
    };

    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.ACCESS_TOKEN_EXPIRY });
  }

  async generateRefreshToken(userId: string): Promise<RefreshTokenEntity> {
    // Generate a random token
    const token = jwt.sign({ sub: userId }, this.JWT_SECRET);
    
    // Set expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);
    
    // Create refresh token entity
    const refreshTokenOrError = RefreshTokenEntity.from(userId, token, expiresAt);
    
    if (refreshTokenOrError instanceof Error) {
      throw refreshTokenOrError;
    }
    
    // Save to repository
    this.refreshTokens.push(refreshTokenOrError);
    
    return refreshTokenOrError;
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
    try {
      // Find token in repository
      const refreshToken = this.refreshTokens.find(rt => rt.token === token);
      
      if (!refreshToken) {
        return null;
      }
      
      // Check if token is expired
      if (refreshToken.expiresAt < new Date()) {
        return null;
      }
      
      // Verify JWT signature
      const decoded = jwt.verify(token, this.JWT_SECRET) as { sub: string };
      
      return { userId: decoded.sub };
    } catch (error) {
      return null;
    }
  }

  async deleteRefreshToken(token: string): Promise<void> {
    const index = this.refreshTokens.findIndex(rt => rt.token === token);
    if (index !== -1) {
      this.refreshTokens.splice(index, 1);
    }
  }
}