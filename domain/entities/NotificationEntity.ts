import { NotificationTypeEnum } from "../enums/NotificationTypeEnum";
import { ReadStatusEnum } from "../enums/ReadStatusEnum";
import { NotificationValue } from "../values/NotificationValue";
import { UserIdValue } from "../values/UserIdValue";

export class NotificationEntity {
    public static from(id: number, userId: string, message: string, readStatus: ReadStatusEnum, type: NotificationTypeEnum, createdAt: Date, senderId?: string, readAt?: Date) {
        
        const validatedUserId = UserIdValue.from(userId);
        if(validatedUserId instanceof Error) {
            return validatedUserId;
        }

        const validatedMessage = NotificationValue.from(message);
        if(validatedMessage instanceof Error) {
            return validatedMessage;
        }

        return new NotificationEntity(id, validatedUserId.value, validatedMessage.value, readStatus, type, createdAt, senderId, readAt);
    }

    private constructor(
        public id: number,
        public userId: string,
        public message: string,
        public readStatus: ReadStatusEnum,
        public type: NotificationTypeEnum,
        public createdAt: Date,
        public senderId?: string,
        public readAt?: Date
    ){}
}