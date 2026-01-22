import { GroupParticipantRepositoryInterface } from "../../../application/ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { GroupParticipantEntity } from "../../../domain/entities/GroupParticipantEntity";

export class InMemoryGroupParticipantRepository implements GroupParticipantRepositoryInterface {
    private readonly participants: Array<GroupParticipantEntity>;

    public constructor() {
        this.participants = [];
    }

    public async addParticipant(participant: GroupParticipantEntity): Promise<GroupParticipantEntity> {
        this.participants.push(participant);
        return participant;
    }

    public async removeParticipant(groupId: string, userId: string): Promise<void> {
        const index = this.participants.findIndex(
            (p) => p.groupId === groupId && p.userId === userId
        );

        if (index !== -1) {
            this.participants.splice(index, 1);
        }
    }

    public async findByGroupId(groupId: string): Promise<GroupParticipantEntity[]> {
        return this.participants.filter((p) => p.groupId === groupId);
    }

    public async findByUserId(userId: string): Promise<GroupParticipantEntity[]> {
        return this.participants.filter((p) => p.userId === userId);
    }

    public async isParticipant(groupId: string, userId: string): Promise<boolean> {
        return this.participants.some(
            (p) => p.groupId === groupId && p.userId === userId
        );
    }
}
