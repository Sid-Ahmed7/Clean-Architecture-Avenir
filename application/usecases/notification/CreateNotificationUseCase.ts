import { NotificationEntity } from "../../../domain/entities/NotificationEntity";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { InvalidNotificationError } from "../../../domain/errors/InvalidNotificationError";
import { InvalidUserIdError } from "../../../domain/errors/InvalidUserIdError";
import { NotificationRepositoryInterface } from "../../ports/repositories/notification/NotificationRepositoryInterface";
import { NotificationPublisher } from "../../ports/services/notification/NotificationPublisher";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";

export class CreateNotificationUseCase {

    public constructor(
        private readonly repositoryNotification: NotificationRepositoryInterface,
        private readonly uuidService: UuidGeneratorService){}


    public async execute(userId: string , message: string, type: NotificationTypeEnum): Promise<NotificationEntity | Error> {

        const notificationId = this.uuidService.generate();
        const notification = NotificationEntity.from(notificationId, userId, message, ReadStatusEnum.UNREAD, type, new Date());

        if(notification instanceof Error  ) {
            return notification;
        }

        const savedNotification = await this.repositoryNotification.save(notification);
        
        if(savedNotification instanceof Error) {
            return savedNotification;
        }

        return savedNotification;
    }
}