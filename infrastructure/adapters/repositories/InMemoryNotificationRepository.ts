import { NotificationNotFoundError } from "../../../application/errors/notification/NotificationNotFoundError";
import { NotificationRepositoryInterface } from "../../../application/ports/repositories/notification/NotificationRepositoryInterface";
import { NotificationEntity } from "../../../domain/entities/NotificationEntity";
import { InvalidNotificationError } from "../../../domain/errors/InvalidNotificationError";
import { InvalidUserIdError } from "../../../domain/errors/InvalidUserIdError";

export class InMemoryNotificationRepository implements NotificationRepositoryInterface {

    private notifications: Array<NotificationEntity>;

    public constructor() {
        this.notifications = [];
    }

    public async save(notification: NotificationEntity): Promise<NotificationEntity | InvalidNotificationError | InvalidUserIdError> {
        if(!notification) {
            return new InvalidNotificationError("Notification invalid")
        }

        if(!notification.userId) {
            return new InvalidUserIdError("UserId invalid")
        }
        
        this.notifications.push(notification);
        return notification;
    }

    public async findByUserId(userId: string): Promise<Array<NotificationEntity>> {
        return this.notifications.filter((notification) => notification.userId === userId);
    }

    public async findById(notificationId: string): Promise<NotificationEntity | NotificationNotFoundError> {
        const notification = this.notifications.find((n) => n.id === notificationId);

        if(!notification) {
        return new NotificationNotFoundError(`Notification with id ${notificationId} not found`);
        }
        return notification;
    }
    public async update(notification: NotificationEntity): Promise<NotificationEntity | NotificationNotFoundError> {
    const index = this.notifications.findIndex((n) => n.id === notification.id); 
    
    if(index === -1) {
        return new NotificationNotFoundError(`Notification with id ${notification.id} not found`);
    }
    
    this.notifications[index] = notification;
    return notification;
    }

    public async delete(notificationId: string): Promise<void | NotificationNotFoundError> {
        const index = this.notifications.findIndex((n) => n.id === notificationId); 
    
        if(index === -1) {
            return new NotificationNotFoundError(`Notification with id ${notificationId} not found`);
        }

        this.notifications.splice(index, 1);
    }


}



