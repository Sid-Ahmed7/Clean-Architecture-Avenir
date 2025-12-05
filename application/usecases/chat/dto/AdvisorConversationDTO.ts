export interface AdvisorConversationDTO {
    id: string;
    clientId: string;
    advisorId: string | null;
    createdAt: Date;
    clientName?: string;
}