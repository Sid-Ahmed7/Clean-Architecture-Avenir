export interface AdvisorConversationDTO {
    id: number;
    clientId: string;
    advisorId: string | null;
    createdAt: Date;
    clientName?: string;
}