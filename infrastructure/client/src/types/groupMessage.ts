import { RoleEnum } from "./RoleEnum";

export interface GroupMessage {
    id: string;
    groupId: string;
    senderId: string;
    senderRole: RoleEnum;
    senderFirstName: string;
    senderLastName: string;
    content: string;
    createdAt: string;
    readBy: string[];
    isManager: boolean;
}