import { ReadStatusEnum } from "../enums/ReadStatusEnum";
import { NotificationValue } from "../values/NotificationValue";
import { UserIdValue } from "../values/UserIdValue";

export class NotificationEntity {
    public static from(userId: string, message: string, readStatus: ReadStatusEnum, createdAt: Date, readAt?: Date) {
        
        const validatedUserId = UserIdValue.from(userId);
        if(validatedUserId instanceof Error) {
            return validatedUserId;
        }

        const validatedMessage = NotificationValue.from(message);
        if(validatedMessage instanceof Error) {
            return validatedMessage;
        }

        return new NotificationEntity(validatedUserId.value, validatedMessage.value, readStatus, createdAt, readAt);
    }

    private constructor(
        public userId: string,
        public message: string,
        public readStatus: ReadStatusEnum,
        public createdAt: Date,
        public readAt?: Date
    ){}
}