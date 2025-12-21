import { NotificationEntity } from "../../../domain/entities/NotificationEntity";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { InvalidNotificationError } from "../../../domain/errors/InvalidNotificationError";
import { InvalidUserIdError } from "../../../domain/errors/InvalidUserIdError";
import { NotificationRepositoryInterface } from "../../ports/repositories/notification/NotificationRepositoryInterface";
import { NotificationPublisher } from "../../ports/services/notification/NotificationPublisher";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";

export class SendNotificationToClientUseCase {

    public constructor(
        private readonly repositoryNotification: NotificationRepositoryInterface,
        private readonly notificationPublisher: NotificationPublisher,
        private readonly uuidService: UuidGeneratorService,
        private readonly userRepository?: UserRepositoryInterface){}


    public async execute(clientId: string , message: string, type: NotificationTypeEnum, senderId?: string): Promise<NotificationEntity | Error> {

        const notificationId = this.uuidService.generate();

        let senderName: string | undefined;
        if (this.userRepository && senderId) {
            const sender = await this.userRepository.findById(senderId);
            if (!(sender instanceof Error)) {
                senderName = `${sender.firstName} ${sender.lastName}`;
            }
        }

        const notification = NotificationEntity.from(notificationId, clientId, message, ReadStatusEnum.UNREAD, type, new Date(), senderId, senderName);

        if(notification instanceof Error  ) {
            return notification;
        }
        const savedNotification = await this.repositoryNotification.save(notification);

        if(savedNotification instanceof Error) {
            return savedNotification;
        }

        this.notificationPublisher.sendNotification(clientId, savedNotification);

        return savedNotification;
    }
}