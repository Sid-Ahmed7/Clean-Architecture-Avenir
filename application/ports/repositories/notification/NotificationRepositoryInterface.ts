import { NotificationEntity } from "../../../../domain/entities/NotificationEntity";
import { InvalidNotificationError } from "../../../../domain/errors/InvalidNotificationError";
import { InvalidUserIdError } from "../../../../domain/errors/InvalidUserIdError";
import { NotificationNotFoundError } from "../../../errors/notification/NotificationNotFoundError";

export interface NotificationRepositoryInterface {
    findByUserId(userId: string): Promise<Array<NotificationEntity>>
    findById(notificationId: number): Promise<NotificationEntity | NotificationNotFoundError>
    save(notification: NotificationEntity): Promise<NotificationEntity | InvalidNotificationError | InvalidUserIdError>;
    update(notification: NotificationEntity): Promise<NotificationEntity | NotificationNotFoundError>
    delete(notificationId: number): Promise<void | NotificationNotFoundError>;
}