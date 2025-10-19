import { MessageModel } from "@/lib/validation/chat/messageSchema";

export interface ChatState {
  messages: MessageModel[];
  isConnected: boolean;
  onlineUsers: Record<string, boolean>;
  error: string | null;
}