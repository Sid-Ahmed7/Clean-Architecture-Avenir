import { RoleEnum } from "./RoleEnum";

export interface GroupParticipant {
    id: string;
    groupId: string;
    userId: string;
    role: RoleEnum;
    joinedAt: string;
    firstName?: string;
    lastName?: string;
}