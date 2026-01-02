import { NotificationNotFoundError } from "../../../../application/errors/notification/NotificationNotFoundError";
import {NotificationRepositoryInterface} from "../../../../application/ports/repositories/notification/NotificationRepositoryInterface";
import { NotificationEntity } from "../../../../domain/entities/NotificationEntity";
import { InvalidNotificationError } from "../../../../domain/errors/InvalidNotificationError";
import { InvalidUserIdError } from "../../../../domain/errors/InvalidUserIdError";
import { pgPool } from "../../config/database/configPostgresSQL";
import {PostgresNotificationRow} from "./types/PostgresNotificationRow";

export class PostgresNotificationRepository implements NotificationRepositoryInterface {

  public async save(notification: NotificationEntity): Promise<NotificationEntity | InvalidNotificationError | InvalidUserIdError> {
    if (!notification) {
      return new InvalidNotificationError("Notification invalid");
    }

    if (!notification.userId) {
      return new InvalidUserIdError("UserId invalid");
    }

    const result = await pgPool.query<PostgresNotificationRow>(
      `INSERT INTO notifications (
        id, user_id, message, read_status, type, created_at, sender_id, sender_name, read_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        notification.id,
        notification.userId,
        notification.message,
        notification.readStatus,
        notification.type,
        notification.createdAt,
        notification.senderId || null,
        notification.senderName || null,
        notification.readAt || null
      ]
    );

    const row = result.rows[0];
    if (!row) {
      return new InvalidNotificationError("Failed to save notification");
    }

    const entity = this.mapRowToEntity(row);
    if (entity instanceof Error) {
      return new InvalidNotificationError(entity.message);
    }

    return entity;
  }

  public async findByUserId(userId: string): Promise<Array<NotificationEntity>> {
    const result = await pgPool.query<PostgresNotificationRow>(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return result.rows
      .map(row => this.mapRowToEntity(row))
      .filter((notification): notification is NotificationEntity => !(notification instanceof Error));
  }

  public async findById(notificationId: string): Promise<NotificationEntity | NotificationNotFoundError> {
    const result = await pgPool.query<PostgresNotificationRow>(
      'SELECT * FROM notifications WHERE id = $1',
      [notificationId]
    );

    if (result.rows.length === 0) {
      return new NotificationNotFoundError(`Notification with id ${notificationId} not found`);
    }

    const row = result.rows[0];
    if (!row) {
      return new NotificationNotFoundError(`Notification with id ${notificationId} not found`);
    }

    const entity = this.mapRowToEntity(row);
    if (entity instanceof Error) {
      return new NotificationNotFoundError(entity.message);
    }

    return entity;
  }

  public async update(notification: NotificationEntity): Promise<NotificationEntity | NotificationNotFoundError> {
    const result = await pgPool.query<PostgresNotificationRow>(
      `UPDATE notifications SET
        message = $1,
        read_status = $2,
        type = $3,
        sender_id = $4,
        sender_name = $5,
        read_at = $6
      WHERE id = $7
      RETURNING *`,
      [
        notification.message,
        notification.readStatus,
        notification.type,
        notification.senderId || null,
        notification.senderName || null,
        notification.readAt || null,
        notification.id
      ]
    );

    if (result.rows.length === 0) {
      return new NotificationNotFoundError(`Notification with id ${notification.id} not found`);
    }

    const row = result.rows[0];
    if (!row) {
      return new NotificationNotFoundError(`Notification with id ${notification.id} not found`);
    }

    const entity = this.mapRowToEntity(row);
    if (entity instanceof Error) {
      return new NotificationNotFoundError(entity.message);
    }

    return entity;
  }

  public async delete(notificationId: string): Promise<void | NotificationNotFoundError> {
    const result = await pgPool.query(
      'DELETE FROM notifications WHERE id = $1',
      [notificationId]
    );

    if (result.rowCount === 0) {
      return new NotificationNotFoundError(`Notification with id ${notificationId} not found`);
    }
  }

  private mapRowToEntity(row: PostgresNotificationRow): NotificationEntity | Error {
    return NotificationEntity.from(
      row.id,
      row.user_id,
      row.message,
      row.read_status,
      row.type,
      row.created_at,
      row.sender_id || undefined,
      row.sender_name || undefined,
      row.read_at || undefined
    );
  }
}