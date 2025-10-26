import { ReadStatusEnum } from "../enums/ReadStatusEnum";
import { MessageContentValue } from "../values/MessageContentValue";
import { UserIdValue } from "../values/UserIdValue";

export class MessageEntity {
    public static from(id: number, conversationId: number,conversationClientId: string, conversationAdvisorId: string | null, authorId: string, content: string, readStatus: ReadStatusEnum, sentAt: Date ) {

        const validatedClientId = UserIdValue.from(conversationClientId);
        if(validatedClientId instanceof Error) {
            return validatedClientId;
        }

        let validatedAdvisorId = null;
        if (conversationAdvisorId) {
            validatedAdvisorId = UserIdValue.from(conversationAdvisorId);
            if(validatedAdvisorId instanceof Error) {
                return validatedAdvisorId;
            }
        }
        const validatedAuthorId = UserIdValue.from(authorId);
        if(validatedAuthorId instanceof Error) {
            return validatedAuthorId;
        }

        const validatedContent = MessageContentValue.from(content);
        if(validatedContent instanceof Error) {
            return validatedContent;
        }

        return new MessageEntity(id, conversationId,validatedClientId.value, validatedAdvisorId?.value || null,validatedAuthorId.value, validatedContent.value, readStatus, sentAt)
    }
        private constructor(
        public id: number,
        public conversationId: number,
        public conversationClientId: string,
        public conversationAdvisorId: string | null,
        public authorId: string,
        public content: string,
        public readStatus: ReadStatusEnum,
        public sentAt: Date
    ){}

}
