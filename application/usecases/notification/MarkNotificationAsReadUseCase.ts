import { NotificationEntity } from "../../../domain/entities/NotificationEntity";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { NotificationRepositoryInterface } from "../../ports/repositories/notification/NotificationRepositoryInterface";

export class MarkNotificationAsReadUseCase {

    public constructor(private notificationRepository: NotificationRepositoryInterface){}

    public async execute(notification: NotificationEntity): Promise<NotificationEntity | Error> {
        notification.readStatus = ReadStatusEnum.READ;
        notification.readAt = new Date();

        const updatedNotification = await this.notificationRepository.update(notification);
        
        if(updatedNotification instanceof Error) {
            return updatedNotification;
        }

        return updatedNotification;

    }
}