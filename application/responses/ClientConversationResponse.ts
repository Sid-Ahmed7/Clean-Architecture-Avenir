export interface ClientConversationResponse {
    id: string;
    clientId: string;
    advisorId: string | null;
    createdAt: Date;
    advisorName?: string;
}