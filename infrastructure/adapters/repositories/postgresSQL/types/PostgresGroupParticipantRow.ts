import { RoleEnum } from "../../../../../domain/enums/RoleEnum";

export interface PostgresGroupParticipantRow {
    id: string;
    group_id: string;
    user_id: string;
    role: RoleEnum;
    joined_at: Date;
}