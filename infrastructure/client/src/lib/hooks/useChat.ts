"use client";

import { useEffect, useReducer, useCallback, useRef } from "react";
import {connectSocket, disconnectSocket, identifyUser, joinConversation, onMessageReceived, onPendingConversation, onUserStatusChanged, isSocketConnected, getSocket, onConversationAssigned, onRemovePendingConversation} from "@/services/chatService";
import { getConversationMessages } from "@/lib/api/chat";
import { Message } from "@/types/message";
import { Conversation } from "@/types/conversation";
import { UserStatus } from "@/types/userStatus";
import { MessageSend } from "@/types/messageSend";
import { Token } from "@/types/token";
import { ChatState } from "@/types/chatState";

type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "SET_USER_STATUS"; payload: UserStatus }
  | { type: "ADD_PENDING_CONVERSATION"; payload: Conversation }
  | { type: "REMOVE_PENDING_CONVERSATION"; payload: number }
  | { type: "ADD_ASSIGNED_CONVERSATION"; payload: Conversation }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: ChatState = {
  messages: [],
  isConnected: false,
  onlineUsers: {},
  pendingConversations: [],
  assignedConversations: [],
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  console.log("[Reducer] Action:", action.type, "Payload:", action.payload);
  switch (action.type) {
    case "ADD_MESSAGE":
      if (state.messages.some((m) => m.id === action.payload.id)){
        return state;
      }
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
      if (!action.payload || action.payload.advisorId){
        return state;
      } 
      if (state.pendingConversations.some((c) => c.id === action.payload.id)) {
        return state;
      } 
      return { ...state, pendingConversations: [...state.pendingConversations, action.payload] };

    case "REMOVE_PENDING_CONVERSATION":
      return {
        ...state,
        pendingConversations: state.pendingConversations.filter((c) => c.id !== action.payload),
      };

    case "ADD_ASSIGNED_CONVERSATION":
      if (!action.payload){
        return state;
      } 
      if (state.assignedConversations.some((c) => c.id === action.payload.id)){
        return state;
      } 
      return {
        ...state,
        assignedConversations: [...state.assignedConversations, action.payload],
      };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      console.warn("[Reducer] Unknown action", action);
      return state;
  }
}

export function useChat(conversationId: number | null, user: Token) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!user){
      return;
    } 

    isMountedRef.current = true;

    const setup = async () => {
      try {
        if (conversationId != null) {
          const history = await getConversationMessages(conversationId);
          if (isMountedRef.current) {
            dispatch({ type: "SET_MESSAGES", payload: history });
          }
        }

        await connectSocket();
        await identifyUser(user.userId, user.role);
        dispatch({ type: "SET_CONNECTED", payload: true });

        if (conversationId != null) {
          joinConversation(conversationId);
        }

        const handleMessage = (msg: Message) => {
          if (!conversationId || msg.conversationId === conversationId) {
            dispatch({ type: "ADD_MESSAGE", payload: msg });
          }
        };

        const handlePending = (conv: Conversation) => {
          dispatch((prev) => {
            if (!conv || conv.advisorId) {
              return prev;
            } 
            if (prev.pendingConversations.some((c : Conversation) => c.id === conv.id)) return prev;
            return { ...prev, pendingConversations: [...prev.pendingConversations, conv] };
          });
        };

        const handleRemovePending = (data: { conversationId: number }) => {
          dispatch({ type: "REMOVE_PENDING_CONVERSATION", payload: data.conversationId });
        };

        const handleConversationAssigned = (data: { conversationId: number; advisorId: string }) => {
          dispatch(prev => {
            const conv = prev.pendingConversations.find((c) => c.id === data.conversationId);

            if (!conv) {
              if(data.advisorId !== user.userId) {
                return prev;
              }
              if (!prev.assignedConversations.some(c => c.id === data.conversationId)) {
                return {
                  ...prev,
                  assignedConversations: [
                    ...prev.assignedConversations,
                    { id: data.conversationId, clientId: "", advisorId: data.advisorId, createdAt: new Date().toISOString() }
                  ],
                };
              }
              return prev;
            }

            if (prev.assignedConversations.some((c) => c.id === conv.id)) {
              return { ...prev, pendingConversations: prev.pendingConversations.filter((c) => c.id !== conv.id) };
            }

            const assignedConv: Conversation = { ...conv, advisorId: data.advisorId };
            return {
              ...prev,
              assignedConversations: [...prev.assignedConversations, assignedConv],
              pendingConversations: prev.pendingConversations.filter(c => c.id !== conv.id),
            };
          });
        };

        const handleUserStatus = (status: UserStatus) => {
          console.log("User status changed", status.userId, status.online);
          dispatch({ type: "SET_USER_STATUS", payload: status });
        };

        onMessageReceived(handleMessage);
        onPendingConversation(handlePending);
        onConversationAssigned(handleConversationAssigned);
        onRemovePendingConversation(handleRemovePending);
        onUserStatusChanged(handleUserStatus);

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
      }
      disconnectSocket();
      dispatch({ type: "SET_CONNECTED", payload: false });
    };
  }, [user?.userId, conversationId]);

  const send = useCallback(
    async (message: MessageSend) => {
      console.log("Sending message", message);
      if (!user || !isSocketConnected()) {
        dispatch({ type: "SET_ERROR", payload: "Utilisateur ou socket non disponible" });
        return;
      }

      const socket = getSocket();
      if (!socket) {
        dispatch({ type: "SET_ERROR", payload: "Socket non disponible" });
        return;
      }

      const socketMessage: any = {
        userId: message.userId,
        conversationId: message.conversationId,
        content: message.content,
        role: message.role,
      };
      if (message.role === "CLIENT") socketMessage.conversationClientId = message.userId;
      if (message.role === "BANK_ADVISOR") socketMessage.conversationAdvisorId = message.userId;

      console.log("[Hook] Emitting socket message", socketMessage);
      socket.emit("message", socketMessage, (res: any) => {
        console.log("[Hook] Socket ack received", res);
        if (res?.error) {
          dispatch({ type: "SET_ERROR", payload: res.error });
        } else if (res?.success && res?.message) {
          dispatch({ type: "ADD_MESSAGE", payload: res.message });
          dispatch({ type: "SET_ERROR", payload: null });
        }
      });
    },
    [user?.userId]
  );

  return {
    messages: state.messages,
    pendingConversations: state.pendingConversations,
    assignedConversations: state.assignedConversations,
    onlineUsers: state.onlineUsers,
    isConnected: state.isConnected,
    error: state.error,
    send,
  };
}
