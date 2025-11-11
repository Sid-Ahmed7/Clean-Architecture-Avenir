
import { useReducer, useEffect, useCallback } from "react";
import * as chatService from "@/services/chatService";
import { UserStatus } from "@/types/userStatus";
import { getConversationMessages } from "../api/chat";
import { Message } from "@/types/message";
import { UserChat } from "@/types/chat/userChat";
import { Typing } from "@/types/chat/typing";
import { MessageSend } from "@/types/messageSend";

type State = {
  messages: Message[];
  conversations: UserChat[];
  pendingConversations: UserChat[];
  onlineUsers: Record<string, UserStatus>;
  typingUsers: Typing[];
  connected: boolean;
};

type Action =
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "ADD_CONVERSATION"; payload: UserChat }
  | { type: "ADD_PENDING_CONVERSATION"; payload: UserChat }
  | { type: "REMOVE_PENDING_CONVERSATION"; payload: number }
  | { type: "SET_USER_STATUS"; payload: UserStatus }
  | { type: "USER_TYPING"; payload: Typing }
  | { type: "USER_STOP_TYPING"; payload: Typing }
  | { type: "MARK_MESSAGES_READ"; payload: number[] };

const initialState: State = {
  messages: [],
  conversations: [],
  pendingConversations: [],
  onlineUsers: {},
  typingUsers: [],
  connected: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CONNECTED":
      return { ...state, connected: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_MESSAGE":
      if (state.messages.some(m => m.id === action.payload.id)) return state;
      return { ...state, messages: [...state.messages, action.payload] };
    case "ADD_CONVERSATION":
      if (state.conversations.find(c => c.id === action.payload.id)) return state;
      return { ...state, conversations: [...state.conversations, action.payload] };
    case "ADD_PENDING_CONVERSATION":
      if (state.pendingConversations.find(c => c.id === action.payload.id)) return state;
      return { ...state, pendingConversations: [...state.pendingConversations, action.payload] };
    case "REMOVE_PENDING_CONVERSATION":
      return { ...state, pendingConversations: state.pendingConversations.filter(c => c.id !== action.payload) };
    case "SET_USER_STATUS":
      return { ...state, onlineUsers: { ...state.onlineUsers, [action.payload.userId]: action.payload } };
    case "USER_TYPING":
      return {
        ...state,
        typingUsers: [...state.typingUsers.filter(u => u.userId !== action.payload.userId), action.payload]
      };
    case "USER_STOP_TYPING":
      return { ...state, typingUsers: state.typingUsers.filter(u => u.userId !== action.payload.userId) };
    case "MARK_MESSAGES_READ":
      return {
        ...state,
        messages: state.messages.map(m => action.payload.includes(m.id) ? { ...m, readStatus: "READ" } : m)
      };
    default:
      return state;
  }
}

export const useChat = (userId: string, role: string, conversationId: number) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    chatService.connectSocket(role);
    chatService.connectSocket("SYSTEM");

    const socket = chatService.getSocket(role);
    const systemSocket = chatService.getSocket("SYSTEM");

    if (!socket || !systemSocket) {
      console.error("Impossible de créer les sockets");
      return;
    }

    const handleConnect = () => {
      if (!isMounted){ return; }

      chatService.identifyUser(userId, role);

      if (conversationId) {
       chatService.joinConversation(conversationId, role);
      }

      dispatch({ type: "SET_CONNECTED", payload: true });
    };

    const handleSystemConnect = () => {
      if (!isMounted) return;

      chatService.identifyUser(userId, "SYSTEM");

      if (conversationId) {
       chatService.joinConversation(conversationId, "SYSTEM");

        cleanupMessage2 = chatService.onMessageReceived("SYSTEM", handleMessage);

        getConversationMessages(conversationId).then(msgs => {
          if (!isMounted){return;}
          const sortedMessages = [
            ...(msgs.messages.client || []),
            ...(msgs.messages.advisor || [])
          ].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
          dispatch({ type: "SET_MESSAGES", payload: sortedMessages });
          console.log(`📚 ${sortedMessages.length} messages chargés`);
        });
      }
    };

    const handleMessage = (msg: Message) => {
      if (msg.conversationId === conversationId) {
        dispatch({ type: "ADD_MESSAGE", payload: msg });
      }
    };

    let cleanupMessage1: (() => void) | undefined;
    let cleanupMessage2: (() => void) | undefined;

    socket.on("connect", () => {
      handleConnect();
      cleanupMessage1 = chatService.onMessageReceived(role, handleMessage);
    });

    systemSocket.on("connect", () => {
      handleSystemConnect();
    });

    const handleTyping = (data: Typing) => {
      if (data.conversationId === conversationId && data.userId !== userId) {
        dispatch({ type: "USER_TYPING", payload: data });
      }
    };

    const handleStopTyping = (data: Typing) => {
      if (data.conversationId === conversationId) {
        dispatch({ type: "USER_STOP_TYPING", payload: data });
      }
    };

    const cleanupTyping = chatService.onUserTyping(handleTyping);
    const cleanupStopTyping = chatService.onUserStopTyping(handleStopTyping);

    const handleConversationAssigned = (conv: UserChat) => dispatch({ type: "ADD_CONVERSATION", payload: conv });
    const handlePendingConversation = (conv: UserChat) => dispatch({ type: "ADD_PENDING_CONVERSATION", payload: conv });
    const handleRemovePending = ({ conversationId: convId }: { conversationId: number }) => dispatch({ type: "REMOVE_PENDING_CONVERSATION", payload: convId });
    const handleUserStatus = (status: UserStatus) => dispatch({ type: "SET_USER_STATUS", payload: status });
    const handleMessagesRead = (ids: number[]) => dispatch({ type: "MARK_MESSAGES_READ", payload: ids });

    const cleanupConvAssigned = chatService.onConversationAssigned(handleConversationAssigned);
    const cleanupPending = chatService.onPendingConversation(handlePendingConversation);
    const cleanupRemovePending = chatService.onRemovePendingConversation(handleRemovePending);
    const cleanupUserStatus = chatService.onUserStatusChanged(handleUserStatus);
    const cleanupMessagesRead = chatService.onMessagesRead(handleMessagesRead);


    return () => {
      isMounted = false;

      cleanupMessage1?.();
      cleanupMessage2?.();
      cleanupTyping?.();
      cleanupStopTyping?.();
      cleanupConvAssigned?.();
      cleanupPending?.();
      cleanupRemovePending?.();
      cleanupUserStatus?.();
      cleanupMessagesRead?.();

      chatService.disconnectSocket(role);
      chatService.disconnectSocket("SYSTEM");
      dispatch({ type: "SET_CONNECTED", payload: false });
    };
  }, [userId, role, conversationId]);


  const send = useCallback((content: string, convId: number) => {
    const msg: MessageSend = { userId, role, conversationId: convId, content };
    chatService.sendMessage(msg, role);
  }, [userId, role]);

  const join = useCallback((convId: number) => {
    chatService.joinConversation(convId, role);
    chatService.joinConversation(convId, "SYSTEM");
  }, [role]);

  const startTyping = useCallback((convId: number) => chatService.sendTyping(convId, userId), [userId]);
  const stopTyping = useCallback((convId: number) => chatService.sendStopTyping(convId, userId), [userId]);
  const markRead = useCallback((messageIds: number[]) => chatService.markMessageAsRead(messageIds, userId), [userId]);

  return {
    ...state,
    send,
    join,
    startTyping,
    stopTyping,
    markRead,
  };
};
