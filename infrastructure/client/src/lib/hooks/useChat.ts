"use client";

import { useEffect, useReducer, useCallback, useContext, act } from "react";
import { useTranslations } from "next-intl";
import {
    connectSocket,
  disconnectSocket,
  joinConversation,
  onMessageReceived,
  onUserStatusChanged,
  sendMessage,
} from "@/services/chatService";
import { MessageModel, messageSchema } from "../validation/chat/messageSchema";
import { AuthContext } from "@/contexts/AuthProvider";
import { ChatState } from "@/types/chatState";
import { UserStatus } from "@/types/userStatus";

type ChatAction =

  | { type: "ADD_MESSAGE"; payload: MessageModel }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "SET_USER_STATUS"; payload: UserStatus  }

const initialState: ChatState = {
  messages: [],
  isConnected: false,
  onlineUsers: {},
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_CONNECTED":
      return {...state, isConnected: action.payload};
    case "SET_USER_STATUS":
      return { ...state, onlineUsers: {...state.onlineUsers, [action.payload.userId]: action.payload.online}}
    default:
      return state;
  }
}

export function useChat(conversationId: number) {
  const t = useTranslations();
  const {isAuthenticated, user} = useContext(AuthContext);
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    if(!isAuthenticated || !user) {
        return;
    }
    const socket = connectSocket();
    
    dispatch({type: "SET_CONNECTED", payload: true});

    joinConversation(conversationId);
    
    onMessageReceived((message) => {
        const parsed = messageSchema(t).safeParse(message);

        if (parsed.success) {
          dispatch({ type: "ADD_MESSAGE", payload: parsed.data });
        }
      });

    onUserStatusChanged((data: UserStatus) => {
      dispatch({type: "SET_USER_STATUS", payload: data});
    })

    socket.emit("identification", {userId: user.userId});

    return () => {
      disconnectSocket();
      dispatch({type: "SET_CONNECTED", payload: false});
    }

  }, [isAuthenticated,t, conversationId, user]);

  const send = useCallback(
    (content: string) => {
      if (!content.trim() || !user) {

        return;
      }

      try {
     sendMessage({
          userId: user?.userId,
          conversationId,
          content,
          role: user?.role, 
        });
      } catch (err) {
        console.error(err);
      }
    },
    [conversationId, user]
  );

  return {
    messages: state.messages,
    isConnected: state.isConnected,
    error: state.error,
    send,
  };
}
