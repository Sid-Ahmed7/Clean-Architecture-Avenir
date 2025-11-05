import { NotificationEntity } from "../../../domain/entities/NotificationEntity";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { NotificationRepositoryInterface } from "../../ports/repositories/notification/NotificationRepositoryInterface";

export class MarkNotificationAsReadUseCase {

    public constructor(private notificationRepository: NotificationRepositoryInterface){}

    public async execute(notificationId: number): Promise<NotificationEntity | Error> {
       const notification = await this.notificationRepository.findById(notificationId);
        
       if(notification instanceof Error) {
            return notification;
        } 

       
        notification.readStatus = ReadStatusEnum.READ;
        notification.readAt = new Date();

        const updatedNotification = await this.notificationRepository.update(notification);
        
        if(updatedNotification instanceof Error) {
            return updatedNotification;
        }

        return updatedNotification;

    }
}