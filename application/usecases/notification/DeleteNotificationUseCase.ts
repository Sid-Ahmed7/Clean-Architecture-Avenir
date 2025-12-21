import { NotificationRepositoryInterface } from "../../ports/repositories/notification/NotificationRepositoryInterface";

export class DeleteNotificationUseCase {

    public constructor(private readonly notificationRepository: NotificationRepositoryInterface){}

    public async execute(notificationId: string): Promise<void | Error> {
        const deletedNotification = await this.notificationRepository.delete(notificationId);
        
        if(deletedNotification instanceof Error) {
            return deletedNotification;
        }
    }
}