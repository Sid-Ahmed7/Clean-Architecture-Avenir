"use client";

import { useEffect, useReducer, useCallback, useRef } from "react";
import {
  connectSocket,
  disconnectSocket,
  identifyUser,
  joinConversation,
  onMessageReceived,
  onPendingConversation,
  onUserStatusChanged,
  isSocketConnected,
  getSocket,
  onConversationAssigned,
  onRemovePendingConversation,
  markMessageAsRead,
  onMessagesRead,
  sendTyping,
  sendStopTyping,
  onUserTyping,
  onUserStopTyping,
} from "@/services/chatService";
import { getConversationMessages } from "@/lib/api/chat";
import { Conversation } from "@/types/Conversation";
import { UserStatus } from "@/types/userStatus";
import { MessageSend } from "@/types/MessageSend";
import { ChatState } from "@/types/ChatState";
import { Message } from "@/types/Message";
import { Token } from "@/types/Token";

type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "SET_USER_STATUS"; payload: UserStatus }
  | { type: "ADD_PENDING_CONVERSATION"; payload: Conversation }
  | { type: "REMOVE_PENDING_CONVERSATION"; payload: number }
  | { type: "ADD_ASSIGNED_CONVERSATION"; payload: Conversation }
  | { type: "MARK_MESSAGES_READ"; payload: number[] }
  | { type: "USER_TYPING"; payload: { conversationId: number; userId: string } }
  | { type: "USER_STOP_TYPING"; payload: { conversationId: number; userId: string } }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: ChatState = {
  messages: [],
  isConnected: false,
  onlineUsers: {},
  pendingConversations: [],
  assignedConversations: [],
  typingUsers: {},
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      if (state.messages.some((m) => m.id === action.payload.id)) return state;
      return { ...state, messages: [...state.messages, action.payload] };

    case "SET_MESSAGES":
      return { ...state, messages: action.payload };

    case "SET_CONNECTED":
      return { ...state, isConnected: action.payload };

    case "SET_USER_STATUS":
      return {
        ...state,
        onlineUsers: { ...state.onlineUsers, [action.payload.userId]: action.payload.online },
      };

    case "ADD_PENDING_CONVERSATION":
      if (!action.payload || action.payload.advisorId) return state;
      if (state.pendingConversations.some((c) => c.id === action.payload.id)) return state;
      return { ...state, pendingConversations: [...state.pendingConversations, action.payload] };

    case "REMOVE_PENDING_CONVERSATION":
      return {
        ...state,
        pendingConversations: state.pendingConversations.filter((c) => c.id !== action.payload),
      };

    case "ADD_ASSIGNED_CONVERSATION":
      if (!action.payload) return state;
      if (state.assignedConversations.some((c) => c.id === action.payload.id)) return state;
      return {
        ...state,
        assignedConversations: [...state.assignedConversations, action.payload],
      };

    case "MARK_MESSAGES_READ":
      return {
        ...state,
        messages: state.messages.map((m) =>
          action.payload.includes(m.id) ? { ...m, readStatus: "READ" } : m
        ),
      };

    case "USER_TYPING": {
      const convId = action.payload.conversationId;
      const existing = state.typingUsers[convId] || [];
      if (existing.includes(action.payload.userId)) return state;
      return {
        ...state,
        typingUsers: { ...state.typingUsers, [convId]: [...existing, action.payload.userId] },
      };
    }

    case "USER_STOP_TYPING": {
      const convId = action.payload.conversationId;
      const existing = state.typingUsers[convId] || [];
      return {
        ...state,
        typingUsers: { ...state.typingUsers, [convId]: existing.filter((id) => id !== action.payload.userId) },
      };
    }

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

export function useChat(conversationId: number | null, user: Token) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const isMountedRef = useRef(true);
    const markRead = useCallback((messageIds: number[]) => {
    if (!user) return;
    markMessageAsRead(messageIds, user.userId);
  }, [user?.userId]);

  const markReadMessage = useCallback(
    (msg: Message) => {
      if (!conversationId) return;
      if (msg.conversationId !== conversationId) return;
      if (msg.authorId === user.userId) return;
      markRead([msg.id]);
    },
    [conversationId, user?.userId, markRead]
  );

  useEffect(() => {
    if (!user) return;

    isMountedRef.current = true;

    const setup = async () => {
      try {
        if (conversationId != null) {
          const history = await getConversationMessages(conversationId);
          const allMessages = [
            ...(history.messages?.client || []),
            ...(history.messages?.advisor || [])
          ].sort((a,b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
          
          if (isMountedRef.current) {
            dispatch({ type: "SET_MESSAGES", payload: allMessages });

          }
        }

        await connectSocket();
        await identifyUser(user.userId, user.role);
        dispatch({ type: "SET_CONNECTED", payload: true });

        if (conversationId != null) {
          joinConversation(conversationId);
        }

        onMessageReceived((msg) => {
          if (!conversationId || msg.conversationId === conversationId) {
            dispatch({ type: "ADD_MESSAGE", payload: msg });
          }

        });

        onPendingConversation((conv) => {
          if (!conv || conv.advisorId) return;
          dispatch({ type: "ADD_PENDING_CONVERSATION", payload: conv });
        });

        onRemovePendingConversation((data) => {
          dispatch({ type: "REMOVE_PENDING_CONVERSATION", payload: data.conversationId });
        });

        onConversationAssigned((data) => {
        });

        onUserStatusChanged((status) => {
          dispatch({ type: "SET_USER_STATUS", payload: status });
        });

        onMessagesRead((ids) => dispatch({ type: "MARK_MESSAGES_READ", payload: ids }));
        onUserTyping((data) => dispatch({ type: "USER_TYPING", payload: data }));
        onUserStopTyping((data) => dispatch({ type: "USER_STOP_TYPING", payload: data }));
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Unknown error" });
      }
    };

    setup();

    return () => {
      isMountedRef.current = false;
      const socket = getSocket();
      if (socket) {
        socket.off("message");
        socket.off("pendingConversation");
        socket.off("conversationAssigned");
        socket.off("removePendingConversation");
        socket.off("userStatusChanged");
        socket.off("messagesRead");
        socket.off("userTyping");
        socket.off("userStopTyping");
      }
      disconnectSocket();
      dispatch({ type: "SET_CONNECTED", payload: false });
    };
  }, [user?.userId, conversationId]);

  const send = useCallback(
    async (message: MessageSend) => {
      if (!user || !isSocketConnected()) return;

      const socket = getSocket();
      if (!socket) return;

      const socketMessage: any = {
        userId: message.userId,
        conversationId: message.conversationId,
        content: message.content,
        role: message.role,
      };
      if (message.role === "CLIENT") socketMessage.conversationClientId = message.userId;
      if (message.role === "BANK_ADVISOR") socketMessage.conversationAdvisorId = message.userId;

      socket.emit("message", socketMessage, (res: any) => {
        if (res?.error) {
          dispatch({ type: "SET_ERROR", payload: res.error });
        } else if (res?.success && res?.message) {
          dispatch({ type: "ADD_MESSAGE", payload: res.message });
        }
      });
    },
    [user?.userId]
  );

  const typing = useCallback((conversationId: number) => {
    if (!user) return;
    sendTyping(conversationId, user.userId);
  }, [user?.userId]);

  const stopTyping = useCallback((conversationId: number) => {
    if (!user) return;
    sendStopTyping(conversationId, user.userId);
  }, [user?.userId]);

  return {
    ...state,
    send,
    markRead,
    typing,
    stopTyping,
  };
}
