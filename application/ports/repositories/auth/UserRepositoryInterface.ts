import { BankUserEntity } from "../../../../domain/entities/BankUserEntity";
import { UserNotFoundError } from "../../../../domain/errors/UserNotFoundError";
import { UserAlreadyExistsError } from "../../../../domain/errors/UserAlreadyExistsError";

export interface UserRepositoryInterface {
    findById(userId: string): Promise<BankUserEntity | UserNotFoundError>;
    findByEmail(email: string): Promise<BankUserEntity | null>;
    createUser(user: BankUserEntity): Promise<BankUserEntity | UserAlreadyExistsError>
    updateUser(user: BankUserEntity): Promise<BankUserEntity | UserNotFoundError>;
}