import { MessageEntity } from "../../../domain/entities/MessageEntity";
import { ReadStatusEnum } from "../../../domain/enums/ReadStatusEnum";
import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class MarkMessageAsReadUseCase {
    public constructor(private readonly messageRepository: MessageRepositoryInterface){}

    public async execute(message: MessageEntity) {
        message.readStatus = ReadStatusEnum.READ;

        const updatedStatusMessage = await this.messageRepository.updateMessage(message);
        if(updatedStatusMessage instanceof Error) {
            return updatedStatusMessage;
        }
        return updatedStatusMessage;
    }
}