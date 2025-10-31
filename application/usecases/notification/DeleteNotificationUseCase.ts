import { NotificationRepositoryInterface } from "../../ports/repositories/notification/NotificationRepositoryInterface";

export class DeleteNotificationUseCase {

    public constructor(private notificationRepository: NotificationRepositoryInterface){}

    public async execute(notificationId: number): Promise<void | Error> {
        const deletedNotification = await this.notificationRepository.delete(notificationId);
        
        if(deletedNotification instanceof Error) {
            return deletedNotification;
        }
    }
}