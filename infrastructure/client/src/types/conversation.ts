export interface Conversation {
  id: number;
  clientId: string;
  advisorId?: string;
  createdAt: string;
  advisorName?: string;
  clientName?:string;
}