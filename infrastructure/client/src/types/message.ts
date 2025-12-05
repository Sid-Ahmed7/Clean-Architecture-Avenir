export interface Message {
    id:string;
    conversationId: string;
    conversationClientId: string;
    conversationAdvisorId: string;
    authorId: string;
    readStatus: "UNREAD" | "READ";
    sentAt: string;
    content: string;    
}