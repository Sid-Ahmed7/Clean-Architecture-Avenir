import { ReadStatusEnum } from "./PostgresEnums";

export interface PostgresNotificationRow {
    id: number;
    user_id: string;
    message: string;
    read_status: ReadStatusEnum;
    created_at: Date;
    read_at: Date | null;
}
