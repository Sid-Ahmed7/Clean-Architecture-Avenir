import { OrderNotFoundError } from "../../../../application/errors/OrderNotFoundError";
import { StockOrderRepositoryInterface } from "../../../../application/ports/repositories/stocks/StockOrderRepositoryInterface";    
import { StockOrderEntity } from "../../../../domain/entities/StockOrderEntity";
import { OrderStatusEnum } from "../../../../domain/enums/OrderStatusEnum";
import { InvalidOrderError } from "../../../../domain/errors/InvalidOrderError";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresStockOrderRow } from "./types/PostgresStockOrderRow";

export class PostgresStockOrderRepository implements StockOrderRepositoryInterface {

    public async createOrder(order: StockOrderEntity): Promise<StockOrderEntity | InvalidOrderError> {
        try {
            const result = await pgPool.query<PostgresStockOrderRow>(
                `INSERT INTO stock_orders (
                    id, user_id, stock_symbol, quantity, order_price, fee,
                    order_type, order_status, created_at, updated_at, executed_at,
                    remaining_quantity, fees_paid
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                RETURNING *`,
                [
                    order.id,
                    order.userId,
                    order.stockSymbol,
                    order.quantity,
                    order.orderPrice,
                    order.fee,
                    order.orderType,
                    order.orderStatus,
                    order.createdAt,
                    order.updatedAt,
                    order.executedAt,
                    order.remainingQuantity,
                    order.feesPaid
                ]
            );

            const row = result.rows[0];
            if (!row) {
                return new InvalidOrderError("Failed to create order");
            }

            const entity = this.mapRowToEntity(row);
            if (entity instanceof Error) {
                return new InvalidOrderError(entity.message);
            }

            return entity;
        } catch (error) {
            const err = error as Error;
            return new InvalidOrderError(`Failed to create order: ${err.message}`);
        }
    }

    public async updateOrder(order: StockOrderEntity): Promise<StockOrderEntity | OrderNotFoundError> {
        const result = await pgPool.query<PostgresStockOrderRow>(
            `UPDATE stock_orders SET
                order_status = $1,
                updated_at = $2,
                executed_at = $3,
                remaining_quantity = $4,
                fees_paid = $5
             WHERE id = $6
             RETURNING *`,
            [
                order.orderStatus,
                order.updatedAt,
                order.executedAt,
                order.remainingQuantity,
                order.feesPaid,
                order.id
            ]
        );

        const row = result.rows[0];
        if (!row) {
            return new OrderNotFoundError(`Order ${order.id} not found`);
        }

        const entity = this.mapRowToEntity(row);
        if (entity instanceof Error) {
            return new OrderNotFoundError(entity.message);
        }

        return entity;
    }

    public async deleteOrder(id: string): Promise<void | OrderNotFoundError> {
        const result = await pgPool.query(
            "DELETE FROM stock_orders WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) {
            return new OrderNotFoundError(`Order ${id} not found`);
        }
    }

    public async findOrderById(id: string): Promise<StockOrderEntity | OrderNotFoundError> {
        const result = await pgPool.query<PostgresStockOrderRow>(
            "SELECT * FROM stock_orders WHERE id = $1",
            [id]
        );

        const row = result.rows[0];
        if (!row) {
            return new OrderNotFoundError(`Order ${id} not found`);
        }

        const entity = this.mapRowToEntity(row);
        if (entity instanceof Error) {
            return new OrderNotFoundError(entity.message);
        }

        return entity;
    }

    public async findOrdersByUserId(userId: string): Promise<StockOrderEntity[]> {
        const result = await pgPool.query<PostgresStockOrderRow>(
            "SELECT * FROM stock_orders WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        return this.mapRowsToEntities(result.rows);
    }

    public async findPendingOrdersBySymbol(symbol: string): Promise<StockOrderEntity[]> {
        const result = await pgPool.query<PostgresStockOrderRow>(
            "SELECT * FROM stock_orders WHERE stock_symbol = $1 AND order_status = $2",
            [symbol, OrderStatusEnum.PENDING]
        );

        return this.mapRowsToEntities(result.rows);
    }

    public async findAllOrders(): Promise<StockOrderEntity[]> {
        const result = await pgPool.query<PostgresStockOrderRow>(
            "SELECT * FROM stock_orders ORDER BY created_at DESC"
        );

        return this.mapRowsToEntities(result.rows);
    }

    public async findActiveOrders(): Promise<StockOrderEntity[]> {
        const result = await pgPool.query<PostgresStockOrderRow>(
            `SELECT * FROM stock_orders
             WHERE order_status IN ($1, $2)
             ORDER BY created_at DESC`,
            [OrderStatusEnum.PENDING, OrderStatusEnum.PARTIALLY_EXECUTED]
        );

        return this.mapRowsToEntities(result.rows);
    }

    public async findActiveOrdersByUserId(userId: string): Promise<StockOrderEntity[]> {
        const result = await pgPool.query<PostgresStockOrderRow>(
            `SELECT * FROM stock_orders
            WHERE user_id = $1 AND order_status IN ($2, $3)
            ORDER BY created_at DESC`,
            [userId, OrderStatusEnum.PENDING, OrderStatusEnum.PARTIALLY_EXECUTED]
        );

        return this.mapRowsToEntities(result.rows);
    }

    public async findActiveOrdersBySymbol(symbol: string): Promise<Array<StockOrderEntity> | Error> {
        try {
            const result = await pgPool.query<PostgresStockOrderRow>(
                `SELECT * FROM stock_orders 
                 WHERE stock_symbol = $1 AND order_status IN ($2, $3)
                 ORDER BY created_at ASC`,
                [symbol, OrderStatusEnum.PENDING, OrderStatusEnum.PARTIALLY_EXECUTED]
            );

        return this.mapRowsToEntities(result.rows);
        } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to find active orders: ${err.message}`);
    }
    }

    public async findOrdersByStatus(status: OrderStatusEnum): Promise<StockOrderEntity[]> {
        const result = await pgPool.query<PostgresStockOrderRow>(
            "SELECT * FROM stock_orders WHERE order_status = $1 ORDER BY created_at DESC",
            [status]
        );

        return this.mapRowsToEntities(result.rows);
    }

    public async findOrdersByUserIdAndSymbol(userId: string, symbol: string): Promise<StockOrderEntity[]> {
        const result = await pgPool.query<PostgresStockOrderRow>(
            "SELECT * FROM stock_orders WHERE user_id = $1 AND stock_symbol = $2 ORDER BY created_at DESC",
            [userId, symbol]
        );

        return this.mapRowsToEntities(result.rows);
    }


    private mapRowsToEntities(rows: PostgresStockOrderRow[]): StockOrderEntity[] {
        return rows
            .map(row => this.mapRowToEntity(row))
            .filter((order): order is StockOrderEntity => !(order instanceof Error));
    }

    private mapRowToEntity(row: PostgresStockOrderRow): StockOrderEntity | Error {
        const order = StockOrderEntity.from(
            row.id,
            row.user_id,
            row.stock_symbol,
            Number(row.quantity),
            Number(row.order_price),
            Number(row.fee),
            row.order_type,
            row.order_status,
            row.created_at,
            row.updated_at,
            row.executed_at ?? undefined,
            Number(row.remaining_quantity)
        );

        if (order instanceof Error) {
            return order;
        }

        order.feesPaid = row.fees_paid;
        return order;
    }
}
