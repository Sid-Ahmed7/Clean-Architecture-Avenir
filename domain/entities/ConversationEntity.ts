import { UserIdValue } from "../values/UserIdValue";

export class ConversationEntity {
    public static from(clientId: string, advisorId: string, createdAt: Date) {
        
        const validatedClientId = UserIdValue.from(clientId);
        if(validatedClientId instanceof Error) {
            return validatedClientId;
        }

        const validatedAdvisorId = UserIdValue.from(advisorId)
        if(validatedAdvisorId instanceof Error) {
            return validatedAdvisorId;
        }

        return new ConversationEntity(clientId, advisorId, createdAt)
    }

    private constructor(
        public clientId: string,
        public advisorId: string,
        public createdAt: Date
    ){}
}