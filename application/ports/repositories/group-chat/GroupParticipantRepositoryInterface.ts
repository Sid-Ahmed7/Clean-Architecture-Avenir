import {GroupParticipantEntity} from "../../../../domain/entities/GroupParticipantEntity";

export interface GroupParticipantRepositoryInterface {
    addParticipant(participant: GroupParticipantEntity): Promise<GroupParticipantEntity>;
    removeParticipant(groupId: string, userId: string): Promise<void>;
    findByGroupId(groupId: string): Promise<GroupParticipantEntity[]>;
    findByUserId(userId: string): Promise<GroupParticipantEntity[]>;
    isParticipant(groupId: string, userId: string): Promise<boolean>;
}