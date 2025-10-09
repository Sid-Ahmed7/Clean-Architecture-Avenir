import { StockRepositoryInterface } from "../../../../application/ports/repositories/StockRepositoryInterface";
import { StockEntity } from "../../../../domain/entities/StockEntity";
import { DataSource } from "typeorm";

export class PostgresStockRepository implements StockRepositoryInterface {
    constructor(private dataSource: DataSource) {}

    async findStockById(id: number): Promise<StockEntity | Error> {
        const result = await this.dataSource.query(
            `SELECT * FROM stocks WHERE id = $1`,
            [id]
        );
        if (!result[0]) return new Error("Stock not found");

        const row = result[0];
        return StockEntity.from(
            row.id,
            row.symbol,
            row.companyName,
            row.name,
            Number(row.currentPrice),
            Number(row.rateOfChange),
            row.currency,
            new Date(row.createdAt),
            row.isActionAvailable,
            new Date(row.updatedAt),
            row.previousPrice ? Number(row.previousPrice) : undefined
        );
    }

    async findStockBySymbol(symbol: string): Promise<StockEntity | Error> {
        const result = await this.dataSource.query(
            `SELECT * FROM stocks WHERE symbol = $1`,
            [symbol]
        );
        if (!result[0]) return new Error("Stock not found");

        const row = result[0];
        return StockEntity.from(
            row.id,
            row.symbol,
            row.companyName,
            row.name,
            Number(row.currentPrice),
            Number(row.rateOfChange),
            row.currency,
            new Date(row.createdAt),
            row.isActionAvailable,
            new Date(row.updatedAt),
            row.previousPrice ? Number(row.previousPrice) : undefined
        );
    }

    async getAllStocks(): Promise<StockEntity[]> {
        const rows = await this.dataSource.query(`SELECT * FROM stocks`);
        return rows.map((row: any) =>
            StockEntity.from(
                row.id,
                row.symbol,
                row.companyName,
                row.name,
                Number(row.currentPrice),
                Number(row.rateOfChange),
                row.currency,
                new Date(row.createdAt),
                row.isActionAvailable,
                new Date(row.updatedAt),
                row.previousPrice ? Number(row.previousPrice) : undefined
            )
        );
    }

    async createStock(stock: StockEntity): Promise<StockEntity | Error> {
        const result = await this.dataSource.query(
            `INSERT INTO stocks (symbol, companyName, name, currentPrice, rateOfChange, currency, isActionAvailable, createdAt, updatedAt, previousPrice)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [
                stock.symbol,
                stock.companyName,
                stock.name,
                stock.currentPrice,
                stock.rateOfChange,
                stock.currency,
                stock.isActionAvailable,
                stock.createdAt,
                stock.updatedAt,
                stock.previousPrice ?? null
            ]
        );

        const row = result[0];
        return StockEntity.from(
            row.id,
            row.symbol,
            row.companyName,
            row.name,
            Number(row.currentPrice),
            Number(row.rateOfChange),
            row.currency,
            new Date(row.createdAt),
            row.isActionAvailable,
            new Date(row.updatedAt),
            row.previousPrice ? Number(row.previousPrice) : undefined
        );
    }

    async updateStock(stock: StockEntity): Promise<StockEntity | Error> {
        await this.dataSource.query(
            `UPDATE stocks SET symbol=$1, companyName=$2, name=$3, currentPrice=$4, rateOfChange=$5, currency=$6, isActionAvailable=$7, updatedAt=$8, previousPrice=$9
             WHERE id=$10`,
            [
                stock.symbol,
                stock.companyName,
                stock.name,
                stock.currentPrice,
                stock.rateOfChange,
                stock.currency,
                stock.isActionAvailable,
                stock.updatedAt,
                stock.previousPrice ?? null,
                stock.id
            ]
        );
        return stock;
    }

    async deleteStock(id: number): Promise<void | Error> {
        await this.dataSource.query(`DELETE FROM stocks WHERE id=$1`, [id]);
    }
}
