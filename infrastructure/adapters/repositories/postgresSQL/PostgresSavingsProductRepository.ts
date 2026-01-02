import { SavingsProductRepositoryInterface } from "../../../../application/ports/repositories/SavingsProductRepositoryInterface";
import { SavingsProductEntity } from "../../../../domain/entities/SavingsProductEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresSavingsProductRow } from "./types/PostgresSavingsProductRow";




export class PostgresSavingsProductRepository implements SavingsProductRepositoryInterface {
   public async createProduct(product: SavingsProductEntity): Promise<SavingsProductEntity | Error> {
        try {
            const result = await pgPool.query<PostgresSavingsProductRow>(
                `INSERT INTO savings_products (
                    id, name, description, interest_rate, max_deposit_amount,
                    min_deposit_amount, is_active, created_at, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *`,
                [
                    product.id,
                    product.name,
                    product.description,
                    product.interestRate,
                    product.maxDepositAmount,
                    product.minDepositAmount,
                    product.isActive,
                    product.createdAt,
                    product.updatedAt
                ]
            );
            const row = result.rows[0];

            if (!row) {
                return new Error('Failed to create product');
            }

            const createdProduct = this.mapRowToEntity(row);
            if (createdProduct instanceof Error) {
                return createdProduct;
            }

            return createdProduct;
        } catch (error: any) {
            return new Error(`Failed to create product: ${error.message}`);
        }
    }
    public async getProductById(id: string): Promise<SavingsProductEntity | Error> {
        const result = await pgPool.query<PostgresSavingsProductRow>(
            'SELECT * FROM savings_products WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return new Error(`Product with ID ${id} not found`);
        }
        const row = result.rows[0];

        if (!row) {
            return new Error(`Product with ID ${id} not found`);
        }
        const product = this.mapRowToEntity(row);
        if (product instanceof Error) {
            return product;
        }

        return product;
    }

    public async getAllProducts(): Promise<SavingsProductEntity[]> {
        const result = await pgPool.query<PostgresSavingsProductRow>('SELECT * FROM savings_products');
        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((product): product is SavingsProductEntity => !(product instanceof Error));
    }

    public async getActiveProducts(): Promise<SavingsProductEntity[]> {
        const result = await pgPool.query<PostgresSavingsProductRow>(
            'SELECT * FROM savings_products WHERE is_active = true'
        );
        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((product): product is SavingsProductEntity => !(product instanceof Error));
    }

    public async updateProduct(product: SavingsProductEntity): Promise<SavingsProductEntity | Error> {
        const result = await pgPool.query<PostgresSavingsProductRow>(
            `UPDATE savings_products SET
                name = $1,
                description = $2,
                interest_rate = $3,
                max_deposit_amount = $4,
                min_deposit_amount = $5,
                is_active = $6,
                updated_at = $7
            WHERE id = $8
            RETURNING *`,
            [
                product.name,
                product.description,
                product.interestRate,
                product.maxDepositAmount,
                product.minDepositAmount,
                product.isActive,
                product.updatedAt,
                product.id
            ]
        );

        if (result.rows.length === 0) {
            return new Error(`Product with ID ${product.id} not found`);
        }
        const row = result.rows[0];

        if (!row) {
            return new Error(`Product with ID ${product.id} not found`);
        }

        const updatedProduct = this.mapRowToEntity(row);
        if (updatedProduct instanceof Error) {
            return updatedProduct;
        }

        return updatedProduct;
    }

    public async deleteProduct(id: string): Promise<boolean | Error> {
        try {
            const result = await pgPool.query(
                'DELETE FROM savings_products WHERE id = $1',
                [id]
            );

            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            const err = error as Error;
            return new Error(`Failed to delete product: ${err.message}`);
    }
    }

    private mapRowToEntity(row: PostgresSavingsProductRow): SavingsProductEntity | Error {
        const product = SavingsProductEntity.create(
            row.id,
            row.name,
            row.description,
            row.interest_rate,
            row.max_deposit_amount,
            row.min_deposit_amount,
            row.is_active
        );

        if (product instanceof Error) {
            return product;
        }

        return product;
    }
}