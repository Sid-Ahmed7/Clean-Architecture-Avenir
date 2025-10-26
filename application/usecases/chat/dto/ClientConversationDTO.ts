export interface ClientConversationDTO {
    id: number;
    clientId: string;
    advisorId: string | null;
    createdAt: Date;
    advisorName?: string;
}