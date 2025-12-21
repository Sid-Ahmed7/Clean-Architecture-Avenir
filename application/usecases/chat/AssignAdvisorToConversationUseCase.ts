import { AdvisorAlreadyAssignedError } from "../../errors/chat/AdvisorAlreadyAssignedError";
import { ConversationNotFoundError } from "../../errors/chat/ConversationNotFoundError";
import { ConversationRepositoryInterface } from "../../ports/repositories/chat/ConversationRepositoryInterface";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class AssignAdvisorToConversationUseCase {
    public constructor(
        private readonly conversationRepository: ConversationRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase
    ) {}

    public async execute(conversationId: string, advisorId: string) {
        const conversation = await this.conversationRepository.findByConversationId(conversationId);

        if (conversation instanceof Error) {
            return conversation;
        }

        if (conversation.advisorId && conversation.advisorId !== "" && conversation.advisorId !== advisorId) {
            return new AdvisorAlreadyAssignedError("An advisor is already assigned to this conversation");
        }

        if (conversation.advisorId === advisorId) {
            return conversation;
        }

        conversation.assignAdvisor(advisorId);
        const result = await this.conversationRepository.update(conversation);

        if (result instanceof Error) {
            return result;
        }

        await this.sendNotificationUseCase.execute(
            advisorId,
            `Votre conversation a été prise en charge par un conseiller.`,
            NotificationTypeEnum.ACTION,
            conversation.clientId
        );

        return result;
    }
}
