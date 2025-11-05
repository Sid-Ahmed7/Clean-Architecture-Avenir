import { NotificationEntity } from "../../../domain/entities/NotificationEntity";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { InvalidNotificationError } from "../../../domain/errors/InvalidNotificationError";
import { InvalidUserIdError } from "../../../domain/errors/InvalidUserIdError";
import { NotificationRepositoryInterface } from "../../ports/repositories/notification/NotificationRepositoryInterface";
import { NotificationPublisher } from "../../ports/services/notification/NotificationPublisher";

export class SendNotificationToClientUseCase {

    public constructor(private repositoryNotification: NotificationRepositoryInterface, private notificationPublisher: NotificationPublisher){}


    public async execute(senderId: string, targetUserId: string , message: string, type: NotificationTypeEnum): Promise<NotificationEntity | Error> {

        const notification = NotificationEntity.from(0, targetUserId, message, ReadStatusEnum.UNREAD, type, new Date(), senderId);

        if(notification instanceof Error  ) {
            return notification;
        }

        const savedNotification = await this.repositoryNotification.save(notification);
        
        if(savedNotification instanceof Error) {
            return savedNotification;
        }

        this.notificationPublisher.sendNotification(targetUserId, savedNotification);

        return savedNotification;
    }
}