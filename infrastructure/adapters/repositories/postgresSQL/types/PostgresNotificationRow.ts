import { NotificationTypeEnum, ReadStatusEnum } from "./PostgresEnums";

export interface PostgresNotificationRow {
    id: string;
    user_id: string;
    message: string;
    read_status: ReadStatusEnum;
    type: NotificationTypeEnum;
    created_at: Date;
    sender_id: string | null;
    sender_name: string | null;
    read_at: Date | null;
}
