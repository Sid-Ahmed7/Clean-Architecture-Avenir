import { UserRepositoryInterface } from "../../../application/ports/repositories/auth/UserRepositoryInterface";
import { BankUserEntity } from "../../../domain/entities/BankUserEntity";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { UserAlreadyExistsError } from "../../../domain/errors/UserAlreadyExistsError";
import { PasswordService } from "../../../application/ports/services/auth/PasswordService";

export class InMemoryUserRepository implements UserRepositoryInterface {
  private users: Array<BankUserEntity>;

  public constructor(private passwordService: PasswordService) {
    this.users = [];
  }

    public async findById(userId: string): Promise<BankUserEntity | UserNotFoundError> {
    const user = this.users.find(u => u.id === userId);
    if(!user) {
      return new UserNotFoundError(`User with id ${userId} not found`);
    }
    return user;
  }

    public async findByEmail(email: string): Promise<BankUserEntity | null> {
    const user = this.users.find(u => u.email === email);
    
    return user ?? null;
  }

  public async createUser(user: BankUserEntity): Promise<BankUserEntity | UserAlreadyExistsError> {
    const existingUser = this.users.find(u => u.email === user.email);
    if(existingUser) {
      return new UserAlreadyExistsError(`User with email ${user.email} already exists`);
    }

    
    const hashedPassword = this.passwordService.hash(user.password);
    
    const isVerified = await this.passwordService.verify(user.password, await hashedPassword);
    if(!isVerified) {
      return new Error("Password hashing failed");
    }

    const newUser = { ...user, password: await hashedPassword };
    this.users.push(newUser);
    return newUser;
  }

   public async updateUser(user: BankUserEntity): Promise<BankUserEntity | UserNotFoundError> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index === -1) return new UserNotFoundError(`User with id ${user.id} not found`);

    this.users[index] = user;
    return user;
  }
}
