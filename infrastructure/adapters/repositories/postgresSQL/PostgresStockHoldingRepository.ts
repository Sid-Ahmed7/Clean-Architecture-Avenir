import { PositionAlreadyExistsError } from "../../../../application/errors/PositionAlreadyExistsError";
import { PositionNotFoundError } from "../../../../application/errors/PositionNotFoundError";
import { StockHoldingRepositoryInterface } from "../../../../application/ports/repositories/stocks/StockHoldingRepositoryInterface";
import { StockHoldingEntity } from "../../../../domain/entities/StockHoldingEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresStockHoldingRow } from "./types/PostgresStockHoldingRow";

export class PostgresStockHoldingRepository implements StockHoldingRepositoryInterface {

    public async createPosition(position: StockHoldingEntity): Promise<StockHoldingEntity | PositionAlreadyExistsError | Error> {
        try {
            const result = await pgPool.query<PostgresStockHoldingRow>(
                `INSERT INTO stock_holdings (
                    id, user_id, stock_symbol, quantity, block_quantity,
                    average_purchase_price, total_invested, created_at, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *`,
                [
                    position.id,
                    position.userId,
                    position.stockSymbol,
                    position.quantity,
                    position.blockQuantity,
                    position.averagePurchasePrice,
                    position.totalInvested,
                    position.createdAt,
                    position.updatedAt
                ]
            );
            const row = result.rows[0];

            if (!row) {
                return new PositionNotFoundError('Position not found');
            }

            const created = this.mapRowToEntity(row);
            if (created instanceof Error) {
                return created;
            }

            return created;
        } catch (error) {
            const err = error as Error;
            return new Error(`Failed to create position: ${err.message}`);
        }
    }

    public async updatePosition(position: StockHoldingEntity): Promise<StockHoldingEntity | PositionNotFoundError | Error> {
        const result = await pgPool.query<PostgresStockHoldingRow>(
            `UPDATE stock_holdings SET
                quantity = $1,
                block_quantity = $2,
                average_purchase_price = $3,
                total_invested = $4,
                updated_at = $5
            WHERE id = $6
            RETURNING *`,
            [
                position.quantity,
                position.blockQuantity,
                position.averagePurchasePrice,
                position.totalInvested,
                position.updatedAt,
                position.id
            ]
        );

        if (result.rows.length === 0) {
            return new PositionNotFoundError(`Position ${position.id} not found`);
        }
        const row = result.rows[0];

        if (!row) {
            return new PositionNotFoundError('Position not found');
        }

        const updated = this.mapRowToEntity(row);
        if (updated instanceof Error) {
            return updated;
        }

        return updated;
    }

    public async deletePosition(id: string): Promise<void | PositionNotFoundError> {
        const result = await pgPool.query('DELETE FROM stock_holdings WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return new PositionNotFoundError(`Position ${id} not found`);
        }
    }

    public async findPositionById(id: string): Promise<StockHoldingEntity | PositionNotFoundError | Error> {
        const result = await pgPool.query<PostgresStockHoldingRow>(
            'SELECT * FROM stock_holdings WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return new PositionNotFoundError(`Position ${id} not found`);
        }
        const row = result.rows[0];

        if (!row) {
            return new PositionNotFoundError('Position not found');
        }


        const position = this.mapRowToEntity(row);
        if (position instanceof Error) {
            return position;
        }

        return position;
    }

    public async findPositionsByUserId(userId: string): Promise<Array<StockHoldingEntity>> {
        const result = await pgPool.query<PostgresStockHoldingRow>(
            'SELECT * FROM stock_holdings WHERE user_id = $1',
            [userId]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((position): position is StockHoldingEntity => !(position instanceof Error));
    }

    public async findPositionByUserIdAndSymbol(userId: string, symbol: string): Promise<StockHoldingEntity | PositionNotFoundError | Error> {
        const result = await pgPool.query<PostgresStockHoldingRow>(
            'SELECT * FROM stock_holdings WHERE user_id = $1 AND stock_symbol = $2',
            [userId, symbol]
        );

        if (result.rows.length === 0) {
            return new PositionNotFoundError(`Position for user ${userId} and stock ${symbol} not found`);
        }
        const row = result.rows[0];

        if (!row) {
            return new PositionNotFoundError('Position not found');
        }


        const position = this.mapRowToEntity(row);
        if (position instanceof Error) {
            return position;
        }

        return position;
    }

    public async findNonEmptyPositions(userId: string): Promise<Array<StockHoldingEntity>> {
        const result = await pgPool.query<PostgresStockHoldingRow>(
            'SELECT * FROM stock_holdings WHERE user_id = $1 AND quantity > 0',
            [userId]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((position): position is StockHoldingEntity => !(position instanceof Error));
    }

    public async findPositionsBySymbol(symbol: string): Promise<Array<StockHoldingEntity>> {
        const result = await pgPool.query<PostgresStockHoldingRow>(
            'SELECT * FROM stock_holdings WHERE stock_symbol = $1',
            [symbol]
        );

        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((position): position is StockHoldingEntity => !(position instanceof Error));
    }

    private mapRowToEntity(row: PostgresStockHoldingRow): StockHoldingEntity | Error {
        const holding = StockHoldingEntity.from(
            row.id,
            row.user_id,
            row.stock_symbol,
            Number(row.quantity),
            Number(row.average_purchase_price),
            Number(row.total_invested),
            row.created_at,
            row.updated_at,
            Number(row.block_quantity)
        );

        if (holding instanceof Error) {
            return holding;
        }

        return holding;
    }
}