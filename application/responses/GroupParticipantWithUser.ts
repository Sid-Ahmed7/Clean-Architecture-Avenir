export interface GroupParticipantWithUser {
    id: string;
    groupId: string;
    userId: string;
    role: string;
    joinedAt: Date;
    firstName: string;
    lastName: string;
}