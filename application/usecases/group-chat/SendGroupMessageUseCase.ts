import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { NotAGroupParticipantError } from "../../errors/NotAGroupParticipantError";
import { GroupConversationRepositoryInterface } from "../../ports/repositories/group-chat/GroupConversationRepositoryInterface";
import { GroupMessageRepositoryInterface } from "../../ports/repositories/group-chat/GroupMessageRepositoryInterface";
import { GroupParticipantRepositoryInterface } from "../../ports/repositories/group-chat/GroupParticipantRepositoryInterface";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { GroupMessageEntity } from './../../../domain/entities/GroupMessageEntity';
import { UserRepositoryInterface } from './../../ports/repositories/auth/UserRepositoryInterface';

export class SendGroupMessageUseCase {

    constructor(
        private readonly groupMessageRepository: GroupMessageRepositoryInterface,
        private readonly groupConversationRepository: GroupConversationRepositoryInterface,
        private readonly groupParticipantRepository: GroupParticipantRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface,
        private readonly uuidGenerator: UuidGeneratorService
    ){}

    public async execute(groupId: string, senderId: string, senderRole: RoleEnum, content: string) : Promise<GroupMessageEntity | Error> {

        const groupConversation = await this.groupConversationRepository.findById(groupId);
        
        if(groupConversation instanceof Error) {
            return groupConversation;
        }

        const isParticipant = await this.groupParticipantRepository.isParticipant(groupId, senderId);
        
        if(!isParticipant) {
            return new NotAGroupParticipantError("Sender is not a participant of the group conversation.");
        }

        const user = await this.userRepository.findById(senderId);
        if(user instanceof Error) {
            return user;
        }

        const messageId = this.uuidGenerator.generate();
        const message = GroupMessageEntity.from(
            messageId,
            groupId,
            senderId,
            senderRole,
            user.firstName,
            user.lastName,
            content,
            new Date(),
            [senderId]
        );

        
        if (message instanceof Error) {
            return message;
        }

        const savedMessage = await this.groupMessageRepository.create(message);
        if(savedMessage instanceof Error) {
            return savedMessage;
        }
        return savedMessage;
    }
}