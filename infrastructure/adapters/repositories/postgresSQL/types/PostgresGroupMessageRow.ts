import { RoleEnum } from "../../../../../domain/enums/RoleEnum";

export interface PostgresGroupMessageRow {
    id: string;
    group_id: string;
    sender_id: string;
    sender_role: RoleEnum;
    sender_first_name: string;
    sender_last_name: string;
    content: string;
    created_at: Date;
    read_by: string[];
}