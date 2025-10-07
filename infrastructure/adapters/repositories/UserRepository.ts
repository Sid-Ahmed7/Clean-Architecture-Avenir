import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { IUserRepository as RegisterUserRepository } from "../../../application/usecases/auth/RegisterUseCase";
import { IUserRepository as RefreshTokenUserRepository } from "../../../application/usecases/auth/RefreshTokenUseCase";
import * as bcrypt from "bcrypt";

// This is a mock in-memory repository for demonstration purposes
// In a real application, this would connect to a database
export class UserRepository implements RegisterUserRepository, RefreshTokenUserRepository {
  private users: BankUserEntity[] = [];

  async save(user: BankUserEntity): Promise<BankUserEntity> {
    // Hash the password before saving
    const hashedPassword = await this.hashPassword(user['password']);

    // Create a new user with the hashed password
    const userWithHashedPassword = BankUserEntity.from(
      user.email,
      hashedPassword,
      user['status'],
      user.firstName,
      user.lastName,
      user.phoneNumber,
      user.dateOfBirth,
      user.address,
      user.isRegistered,
      undefined, // resetPasswordToken
      undefined, // resetTokenExpiresAt
      user.id,
      user.createdAt
    );

    if (userWithHashedPassword instanceof Error) {
      throw userWithHashedPassword;
    }

    // Check if user already exists (for updates)
    const existingUserIndex = this.users.findIndex(u => u.id === user.id);
    if (existingUserIndex >= 0) {
      this.users[existingUserIndex] = userWithHashedPassword;
    } else {
      this.users.push(userWithHashedPassword);
    }

    return userWithHashedPassword;
  }

  async findByEmail(email: string): Promise<BankUserEntity | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async findById(userId: string): Promise<BankUserEntity | null> {
    const user = this.users.find(u => u.id === userId);
    return user || null;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
