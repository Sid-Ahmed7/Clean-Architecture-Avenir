"use client";

import io from "socket.io-client";
import Cookies from "js-cookie";
import { Message } from "@/types/message";
import { MessageSend } from "@/types/messageSend";
import { UserStatus } from "@/types/userStatus";

let socket: ReturnType<typeof io> | null = null;

export const connectSocket = (): ReturnType<typeof io> => {
  if (!socket) {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("Token not found");
    }

    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
    });
  }

  return socket;
};

export const joinConversation = (conversationId: number) => {
    socket?.emit("joinConversation", conversationId)
}
export const sendMessage = (message: MessageSend) => {
    socket?.emit("messages", message);
}

export const onMessageReceived = (callback: (message: Message) => void ) => {
    socket?.on("message", callback);
}

export const onUserStatusChanged = (callback: (data:UserStatus) => void) => {
  socket?.on("userStatus", callback);
}

export const disconnectSocket = () => {
    if(socket) {
        socket.disconnect();
        socket = null;
    }
}

