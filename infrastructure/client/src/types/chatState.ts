import { Conversation } from "./conversation";
import { Message } from "./message";

export interface ChatState {
  messages: Message[];
  pendingConversations: Conversation[];
  onlineUsers: Record<string, boolean>; 
  isConnected: boolean;
  assignedConversations: Conversation[];
  error: string | null;
}
