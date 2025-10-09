import { BankUserEntity } from "../../../../domain/entities/BankUserEntity";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { UserAlreadyExistsError } from "../../../errors/UserAlreadyExistsError";

export interface UserRepositoryInterface {
    findById(userId: string): Promise<BankUserEntity | UserNotFoundError>;
    findByEmail(email: string): Promise<BankUserEntity | null>;
    createUser(user: BankUserEntity): Promise<BankUserEntity | UserAlreadyExistsError>
    updateUser(user: BankUserEntity): Promise<BankUserEntity | UserNotFoundError>;
}