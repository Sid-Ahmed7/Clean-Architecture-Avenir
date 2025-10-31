import { NotificationRepositoryInterface } from "../../ports/repositories/notification/NotificationRepositoryInterface";

export class GetUserNotificationUseCase {
    public constructor(private notificationRepository: NotificationRepositoryInterface) {}

    public async execute(userId: string) {
        const notification = await this.notificationRepository.findByUserId(userId);

        if(notification instanceof Error) {
            return notification;
        }

        return notification;
    }
}