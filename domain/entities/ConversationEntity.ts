import { UserIdValue } from "../values/UserIdValue";

export class ConversationEntity {
    public static from(id: string, clientId: string, advisorId: string | undefined, createdAt: Date) {

        const validatedClientId = UserIdValue.from(clientId);
        if(validatedClientId instanceof Error) {
            return validatedClientId;
        }

        if (advisorId) {
            const validatedAdvisorId = UserIdValue.from(advisorId);
            if(validatedAdvisorId instanceof Error) {
                return validatedAdvisorId;
            }
        }

        return new ConversationEntity(id, validatedClientId.value, advisorId, createdAt)
    }

    private constructor(
        public id: string,
        public clientId: string,
        public advisorId: string | undefined,
        public createdAt: Date
    ){}

    public assignAdvisor(advisorId: string) {
        this.advisorId = advisorId;
    }

    public transferAdvisor(newAdvisorId: string) {
        this.advisorId = newAdvisorId;
    }

    public hasAdvisor(): boolean {
        return !!this.advisorId;
    }
}