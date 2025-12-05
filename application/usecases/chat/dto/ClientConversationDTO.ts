export interface ClientConversationDTO {
    id: string;
    clientId: string;
    advisorId: string | null;
    createdAt: Date;
    advisorName?: string;
}