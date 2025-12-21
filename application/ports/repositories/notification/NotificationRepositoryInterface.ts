import { NotificationEntity } from "../../../../domain/entities/NotificationEntity";
import { InvalidNotificationError } from "../../../../domain/errors/InvalidNotificationError";
import { InvalidUserIdError } from "../../../../domain/errors/InvalidUserIdError";
import { NotificationNotFoundError } from "../../../errors/notification/NotificationNotFoundError";

export interface NotificationRepositoryInterface {
    findByUserId(userId: string): Promise<Array<NotificationEntity>>
    findById(notificationId: string): Promise<NotificationEntity | NotificationNotFoundError>
    save(notification: NotificationEntity): Promise<NotificationEntity | InvalidNotificationError | InvalidUserIdError>;
    update(notification: NotificationEntity): Promise<NotificationEntity | NotificationNotFoundError>
    delete(notificationId: string): Promise<void | NotificationNotFoundError>;
}