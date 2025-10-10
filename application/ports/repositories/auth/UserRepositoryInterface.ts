import { BankUserEntity } from "../../../../domain/entities/BankUserEntity";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { UserAlreadyExistsError } from "../../../errors/UserAlreadyExistsError";
import { TokenNotFoundError } from "../../../errors/TokenNotFoundError";
import { ExpiredTokenError } from "../../../errors/ExpiredTokenError";

export interface UserRepositoryInterface {
    findById(userId: string): Promise<BankUserEntity | UserNotFoundError>;
    findByEmail(email: string): Promise<BankUserEntity | null>;
    findConfirmationToken(token: string): Promise<BankUserEntity | UserNotFoundError | TokenNotFoundError | ExpiredTokenError>;
    createUser(user: BankUserEntity): Promise<BankUserEntity | UserAlreadyExistsError>
    updateUser(user: BankUserEntity): Promise<BankUserEntity | UserNotFoundError>;
}