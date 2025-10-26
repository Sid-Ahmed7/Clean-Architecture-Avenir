export interface Message {
    id:number;
    conversationId: number;
    conversationClientId: string;
    conversationAdvisorId: string;
    authorId: string;
    readStatus: "UNREAD" | "READ";
    sentAt: string;
    content: string;    
}