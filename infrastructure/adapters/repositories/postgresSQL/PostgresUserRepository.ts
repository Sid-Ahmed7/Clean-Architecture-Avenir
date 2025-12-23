import { ExpiredTokenError } from "../../../../application/errors/ExpiredTokenError";
import { TokenNotFoundError } from "../../../../application/errors/TokenNotFoundError";
import { UserAlreadyExistsError } from "../../../../application/errors/UserAlreadyExistsError";
import { UserNotFoundError } from "../../../../application/errors/UserNotFoundError";
import { UserRepositoryInterface } from "../../../../application/ports/repositories/auth/UserRepositoryInterface";
import { BankUserEntity } from "../../../../domain/entities/BankUserEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresBankUserRow } from "./types/PostgresBankUserRow";



export class PostgresUserRepository implements UserRepositoryInterface {

    public async findById(userId: string): Promise<BankUserEntity | UserNotFoundError> {

        const result = await pgPool.query<PostgresBankUserRow>('SELECT * FROM bank_users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return new UserNotFoundError(`User with ID ${userId} not found.`);
        }
        const row = result.rows[0];
        if(!row) {
            return new UserNotFoundError(`User with ID ${userId} not found.`);
        }

        const user = this.mapRowToEntity(row);

        return user;
    }

     public async findByIds(ids: string[]): Promise<Array<BankUserEntity>> {
        const result = await pgPool.query<PostgresBankUserRow>('SELECT * FROM bank_users');
        return result.rows
        .map(row => this.mapRowToEntity(row))
        .filter((user): user is BankUserEntity => !(user instanceof Error));
}

    public async findByEmail(email: string): Promise<BankUserEntity | null> {
        const result = await pgPool.query<PostgresBankUserRow>('SELECT * FROM bank_users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        if(!row) {
            return null;
        }

        const user = this.mapRowToEntity(row);
     
         if (user instanceof Error) {
        return null;
    }

    return user;
    }

    public async findConfirmationToken(token: string): Promise<BankUserEntity | UserNotFoundError | TokenNotFoundError | ExpiredTokenError> {
        const result = await pgPool.query<PostgresBankUserRow>('SELECT * FROM bank_users WHERE confirmation_token = $1', [token]);
        if (result.rows.length === 0) {
            return new UserNotFoundError(`User with confirmation token ${token} not found.`);
        }
        const row = result.rows[0];
        if(!row) {
            return new UserNotFoundError(`User with confirmation token ${token} not found.`);
        }

        const user = this.mapRowToEntity(row);
        if (user instanceof Error) {
            return user;
        }

        if (!user.confirmationToken) {
            return new TokenNotFoundError(`Confirmation token ${token} not found.`);
        }
        if (!user.confirmationTokenExpiresAt || user.confirmationTokenExpiresAt < new Date()) {
            return new ExpiredTokenError("The confirmation link has expired");
        }
        return user;
    }

  public async findAll(): Promise<BankUserEntity[]> {
    const result = await pgPool.query<PostgresBankUserRow>('SELECT * FROM bank_users');

    return result.rows
        .map(row => this.mapRowToEntity(row))
        .filter((user): user is BankUserEntity => !(user instanceof Error));
}

    public async createUser(user: BankUserEntity): Promise<BankUserEntity | UserAlreadyExistsError> {
        const existingUser = await this.findByEmail(user.email);
        if (existingUser) {
         return new UserAlreadyExistsError(`User with email ${user.email} already exists`);
        }
        const result = await pgPool.query<PostgresBankUserRow>(
            `INSERT INTO bank_users (
                id, email, password, status, first_name, last_name,
                phone_number, date_of_birth, address, is_registered,
                confirmation_token, confirmation_token_expires_at,
                reset_password_token, reset_token_expires_at, created_at
            )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             RETURNING *`,
            [
                user.id,
                user.email,
                user.password,
                user.status,
                user.firstName,
                user.lastName,
                user.phoneNumber,
                user.dateOfBirth,
                user.address,
                user.isRegistered,
                user.confirmationToken,
                user.confirmationTokenExpiresAt,
                user.resetPasswordToken,
                user.resetTokenExpiresAt,
                user.createdAt
            ]
        );
        const row = result.rows[0];
        if(!row) {
            return new UserNotFoundError(`User with  not found.`);
        }
        return this.mapRowToEntity(row);
    }

    public async updateUser(user: BankUserEntity): Promise<BankUserEntity | UserNotFoundError> {
        const result = await pgPool.query<PostgresBankUserRow>(
            `UPDATE bank_users SET
                email = $1,
                password = $2,
                status = $3,
                first_name = $4,
                last_name = $5,
                phone_number = $6,
                date_of_birth = $7,
                address = $8,
                is_registered = $9,
                confirmation_token = $10,
                confirmation_token_expires_at = $11,
                reset_password_token = $12,
                reset_token_expires_at = $13
            WHERE id = $14
            RETURNING *`,
            [
                user.email,
                user.password,
                user.status,
                user.firstName,
                user.lastName,
                user.phoneNumber,
                user.dateOfBirth,
                user.address,
                user.isRegistered,
                user.confirmationToken,
                user.confirmationTokenExpiresAt,
                user.resetPasswordToken,
                user.resetTokenExpiresAt,
                user.id
            ]
        );

        if (result.rows.length === 0) {
            return new UserNotFoundError(`User with ID ${user.id} not found.`);
        }
        const row = result.rows[0];
        if(!row) {
            return new UserNotFoundError(`User with ID ${user.id} not found.`);
        }

        return this.mapRowToEntity(row);
    }

    public async deleteUser(userId: string): Promise<void | UserNotFoundError> {
        const result = await pgPool.query(
            'DELETE FROM bank_users WHERE id = $1 RETURNING id',
            [userId]
        );

        if (result.rows.length === 0) {
            return new UserNotFoundError(`User with ID ${userId} not found.`);
        }
    }

    private mapRowToEntity = (row: PostgresBankUserRow): BankUserEntity | Error => {
        const user = BankUserEntity.from(
            row.id,
            row.email,
            row.password,
            row.status,
            row.first_name,
            row.last_name,
            row.phone_number,
            row.date_of_birth,
            row.address,
            row.is_registered,
            row.confirmation_token ?? undefined,
            row.confirmation_token_expires_at ?? undefined,
            row.reset_password_token ?? undefined,
            row.reset_token_expires_at ?? undefined,
            row.created_at
        );

        return user;
    }

}