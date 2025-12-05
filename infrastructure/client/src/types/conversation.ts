export interface Conversation {
  id: string;
  clientId: string;
  advisorId?: string;
  createdAt: string;
  advisorName?: string;
  clientName?:string;
}