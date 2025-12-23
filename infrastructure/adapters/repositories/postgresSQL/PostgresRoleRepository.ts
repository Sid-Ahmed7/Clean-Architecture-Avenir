
import { RoleNotFoundError } from "../../../../application/errors/RoleNotFoundError";
import { RoleRepositoryInterface } from "../../../../application/ports/repositories/auth/RoleRepositoryInterface";
import { RoleEntity } from "../../../../domain/entities/RoleEntity";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresRoleRow } from "./types/PostgresRoleRow";

export class PostgresRoleRepository implements RoleRepositoryInterface {

    async initialize(): Promise<void> {
        const defaultRoles = Object.values(RoleEnum);

        for (const roleName of defaultRoles) {
            await pgPool.query(
                'INSERT INTO roles (id, name) VALUES (gen_random_uuid()::text, $1) ON CONFLICT (name) DO NOTHING',
                [roleName]
            );
        }
    }

    async findByName(name: RoleEnum): Promise<RoleEntity | RoleNotFoundError> {
        const result = await pgPool.query<PostgresRoleRow>(
            'SELECT * FROM roles WHERE name = $1',
            [name]
        );

        if (result.rows.length === 0) {
            return new RoleNotFoundError(`Role with name ${name} not found`);
        }

        const row = result.rows[0];

        if (!row) {
            return new RoleNotFoundError(`Role with name ${name} not found`);
        }

        return RoleEntity.from(row.id, row.name as RoleEnum);
    }

    async findById(id: string): Promise<RoleEntity | RoleNotFoundError> {
        const result = await pgPool.query<PostgresRoleRow>(
            'SELECT * FROM roles WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return new RoleNotFoundError(`Role with id ${id} not found`);
        }

        const row = result.rows[0];

        if (!row) {
            return new RoleNotFoundError(`Role with id ${id} not found`);
        }

        return RoleEntity.from(row.id, row.name as RoleEnum);
    }
}
