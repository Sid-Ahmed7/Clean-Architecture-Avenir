export interface AdvisorConversationResponse {
    id: string;
    clientId: string;
    advisorId: string | null;
    createdAt: Date;
    clientName?: string;
}