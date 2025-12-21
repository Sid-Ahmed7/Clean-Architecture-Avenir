import { MessageRepositoryInterface } from "../../ports/repositories/chat/MessageRepositoryInterface";

export class GetUnreadMessagesUseCase {
  constructor(private readonly messageRepository: MessageRepositoryInterface) {}

  public async execute(userId: string) {
    const unreadMessages = await this.messageRepository.findUnreadByRecipient(userId);
    const messages = unreadMessages.map((message) => message.id)
    
    return messages;
  }
}
