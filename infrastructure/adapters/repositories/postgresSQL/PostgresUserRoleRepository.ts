import { RoleNotFoundError } from "../../../../application/errors/RoleNotFoundError";
import { UserNotFoundError } from "../../../../application/errors/UserNotFoundError";
import { UserRoleRepositoryInterface } from "../../../../application/ports/repositories/auth/UserRoleRepositoryInterface";
import { RoleEntity } from "../../../../domain/entities/RoleEntity";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresRoleRow } from "./types/PostgresRoleRow";


export class PostgresUserRoleRepository implements UserRoleRepositoryInterface {

    async findRolesByUserId(userId: string): Promise<RoleEntity[] | RoleNotFoundError> {
        const result = await pgPool.query<PostgresRoleRow>(
            `SELECT r.id, r.name
             FROM roles r
             INNER JOIN user_roles ur ON r.id = ur.role_id
             WHERE ur.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return new RoleNotFoundError(`No roles found for user with id ${userId}`);
        }

        return result.rows.map(row => RoleEntity.from(row.id, row.name as RoleEnum));
    }

    async addRoleToUser(userId: string, roleId: string): Promise<void | UserNotFoundError | RoleNotFoundError> {
        const userCheck = await pgPool.query('SELECT id FROM bank_users WHERE id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return new UserNotFoundError(`User with id ${userId} not found`);
        }

        const roleCheck = await pgPool.query('SELECT id FROM roles WHERE id = $1', [roleId]);
        if (roleCheck.rows.length === 0) {
            return new RoleNotFoundError(`Role with id ${roleId} not found`);
        }

        await pgPool.query(
            `INSERT INTO user_roles (user_id, role_id) 
             VALUES ($1, $2)
             ON CONFLICT (user_id, role_id) DO NOTHING`,
            [userId, roleId]
        );
    }
}
