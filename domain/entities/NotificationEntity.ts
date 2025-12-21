import { NotificationTypeEnum } from "../enums/NotificationTypeEnum";
import { ReadStatusEnum } from "../enums/ReadStatusEnum";
import { NotificationValue } from "../values/NotificationValue";
import { UserIdValue } from "../values/UserIdValue";

export class NotificationEntity {
    public static from(id: string, userId: string, message: string, readStatus: ReadStatusEnum, type: NotificationTypeEnum, createdAt: Date, senderId?: string, senderName?: string, readAt?: Date) {

        const validatedUserId = UserIdValue.from(userId);
        if(validatedUserId instanceof Error) {
            return validatedUserId;
        }

        const validatedMessage = NotificationValue.from(message);
        if(validatedMessage instanceof Error) {
            return validatedMessage;
        }

        return new NotificationEntity(id, validatedUserId.value, validatedMessage.value, readStatus, type, createdAt, senderId, senderName, readAt);
    }

    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly message: string,
        public readStatus: ReadStatusEnum,
        public readonly type: NotificationTypeEnum,
        public readonly createdAt: Date,
        public readonly senderId?: string,
        public readonly senderName?: string,
        public readAt?: Date
    ){}
}