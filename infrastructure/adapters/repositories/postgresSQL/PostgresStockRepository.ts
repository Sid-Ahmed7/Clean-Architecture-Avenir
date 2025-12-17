import { StockNotFoundError } from "../../../../application/errors/StockNotFoundError";
import { StockRepositoryInterface } from "../../../../application/ports/repositories/stocks/StockRepositoryInterface";
import { StockEntity } from "../../../../domain/entities/StockEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresStockRow } from "./types/PostgresStockRow";
import { StockAlreadyExistsError } from "../../../../application/errors/StockAlreadyExistsError";


export class PostgresStockRepository implements StockRepositoryInterface {

    public async findStockById(id: string): Promise<StockEntity | StockNotFoundError | Error> {
        const result = await pgPool.query<PostgresStockRow>(
            'SELECT * FROM stocks WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return new StockNotFoundError(`Stock with ID ${id} not found`);
        }

        const stock = this.mapRowToEntity(result.rows[0]);
        if (stock instanceof Error) {
            return stock;
        }

        return stock;
    }

    public async findStockBySymbol(symbol: string): Promise<StockEntity | StockNotFoundError | Error> {
        const result = await pgPool.query<PostgresStockRow>(
            'SELECT * FROM stocks WHERE symbol = $1',
            [symbol]
        );

        if (result.rows.length === 0) {
            return new StockNotFoundError(`Stock with symbol ${symbol} not found`);
        }

        const stock = this.mapRowToEntity(result.rows[0]);
        if (stock instanceof Error) {
            return stock;
        }

        return stock;
    }

    public async getAllStocks(): Promise<Array<StockEntity>> {
        const result = await pgPool.query<PostgresStockRow>('SELECT * FROM stocks');
        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((stock): stock is StockEntity => !(stock instanceof Error));
    }

    public async getAvailableStocks(): Promise<Array<StockEntity>> {
        const result = await pgPool.query<PostgresStockRow>(
            'SELECT * FROM stocks WHERE is_action_available = true'
        );
        return result.rows
            .map(row => this.mapRowToEntity(row))
            .filter((stock): stock is StockEntity => !(stock instanceof Error));
    }

    public async createStock(stock: StockEntity): Promise<StockEntity | StockAlreadyExistsError | Error> {
        const existing = await this.findStockBySymbol(stock.symbol);
        if (!(existing instanceof StockNotFoundError) && !(existing instanceof Error)) {
            return new StockAlreadyExistsError(`Stock with symbol ${stock.symbol} already exists`);
        }

        const result = await pgPool.query<PostgresStockRow>(
            `INSERT INTO stocks (
                id, symbol, company_name, name, current_price, rate_of_change,
                currency, created_at, is_action_available, updated_at, total_shares,
                previous_price, ipo_active, available_shares_for_ipo, ipo_type
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *`,
            [
                stock.id,
                stock.symbol,
                stock.companyName,
                stock.name,
                stock.currentPrice,
                stock.rateOfChange,
                stock.currency,
                stock.createdAt,
                stock.isActionAvailable,
                stock.updatedAt,
                stock.totalShares,
                stock.previousPrice,
                stock.ipoActive,
                stock.availableSharesForIPO,
                stock.ipoType
            ]
        );

        const created = this.mapRowToEntity(result.rows[0]);
        if (created instanceof Error) {
            return created;
        }

        return created;
    }

    public async updateStock(stock: StockEntity): Promise<StockEntity | StockNotFoundError | Error> {
        const result = await pgPool.query<PostgresStockRow>(
            `UPDATE stocks SET
                current_price = $1,
                rate_of_change = $2,
                is_action_available = $3,
                updated_at = $4,
                previous_price = $5,
                ipo_active = $6,
                available_shares_for_ipo = $7,
                ipo_type = $8
            WHERE id = $9
            RETURNING *`,
            [
                stock.currentPrice,
                stock.rateOfChange,
                stock.isActionAvailable,
                stock.updatedAt,
                stock.previousPrice,
                stock.ipoActive,
                stock.availableSharesForIPO,
                stock.ipoType,
                stock.id
            ]
        );

        if (result.rows.length === 0) {
            return new StockNotFoundError(`Stock with ID ${stock.id} not found`);
        }

        const updated = this.mapRowToEntity(result.rows[0]);
        if (updated instanceof Error) {
            return updated;
        }

        return updated;
    }

    public async deleteStock(id: string): Promise<void | StockNotFoundError> {
        const result = await pgPool.query('DELETE FROM stocks WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return new StockNotFoundError(`Stock with ID ${id} not found`);
        }
    }

    private mapRowToEntity(row: PostgresStockRow): StockEntity | Error {
        const stock = StockEntity.from(
            row.id,
            row.symbol,
            row.company_name,
            row.name,
            row.current_price,
            row.rate_of_change,
            row.currency,
            row.created_at,
            row.is_action_available,
            row.updated_at,
            row.total_shares,
            row.previous_price ?? undefined,
            row.ipo_active,
            row.available_shares_for_ipo,
            row.ipo_type ?? undefined
        );

        if (stock instanceof Error) {
            return stock;
        }

        return stock;
    }
}