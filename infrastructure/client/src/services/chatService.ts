"use client";

import io from "socket.io-client";
import { Message } from "@/types/message";
import { MessageSend } from "@/types/messageSend";
import { UserStatus } from "@/types/userStatus";
import { Conversation } from "@/types/conversation";
import { UserChat } from "@/types/userChat";

let socket: ReturnType<typeof io> | null = null;
let isConnecting = false;
let connectionTimeout: NodeJS.Timeout | null = null;
let isIdentified = false;
let authenticatedUserId: string | null = null;
let authenticatedUserRole: string | null = null;
let refCount = 0;

export const connectSocket = (): Promise<ReturnType<typeof io>> => {
  return new Promise((resolve, reject) => {
    if (socket?.connected) {
      refCount++;
      return resolve(socket);
    }

    if (isConnecting) {
      const checkInterval = setInterval(() => {
        if (socket?.connected) {
          clearInterval(checkInterval);
          refCount++;
          resolve(socket);
        }
      }, 100);
      return;
    }

    isConnecting = true;
    refCount++;

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    const cleanUp = () => {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
      }
      isConnecting = false;
    };

    socket.on("connect", () => {
      console.log("Connected:", socket?.id);
      cleanUp();

      if (authenticatedUserId && authenticatedUserRole && !isIdentified) {
        identifyUser(authenticatedUserId, authenticatedUserRole)
          .then(() => console.log("Re-identification réussie"))
          .catch(err => console.error("Re-identification failed:", err));
      }
      if (socket != null) {
        resolve(socket);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      cleanUp();
      refCount = Math.max(0, refCount - 1);
      reject(err);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      isConnecting = false;
      isIdentified = false;
    });

    connectionTimeout = setTimeout(() => {
      if (isConnecting) {
        cleanUp();
        refCount = Math.max(0, refCount - 1);
        reject(new Error("Socket connection timeout"));
      }
    }, 10000);
  });
};


export const identifyUser = async (userId: string, role: string): Promise<void> => {
  if (!socket?.connected) throw new Error("Socket not connected");
  if (isIdentified) return;

  authenticatedUserId = userId;
  authenticatedUserRole = role;

  await new Promise<void>((resolve, reject) => {
    socket!.emit("identification", { userId, role }, (response: any) => {
      if (response?.error) reject(new Error(response.error));
      else resolve();
    });
  });

  isIdentified = true;
};

export const disconnectSocket = () => {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0 && socket) {
    try {
      socket.disconnect();
    } catch (err) {
      console.error("Error during socket.disconnect:", err);
    } finally {
      socket = null;
      isConnecting = false;
      isIdentified = false;
      authenticatedUserId = null;
      authenticatedUserRole = null;
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
      }
    }
  }
};


export const joinConversation = (conversationId: number) => {
  if (!socket?.connected) return;
  socket.emit("joinConversation", conversationId);
};

export const sendMessage = (message: MessageSend, callback?: (res: any) => void) => {
  if (!socket?.connected) return;
  socket.emit("message", message, callback);
};

export const onMessageReceived = (callback: (message: Message) => void) => {
  if (!socket) return;
  socket.off("message");
  socket.on("message", callback);
};

export const onConversationAssigned =(callback: (data: UserChat) => void ) => {
  if(!socket) return;
  socket.off("conversationAssigned");
  socket.on("conversationAssigned", callback);
};

export const onRemovePendingConversation =(callback: (data :{conversationId: number}) => void ) => {
  if(!socket) return;
  socket.off("removePendingConversation");
  socket.on("removePendingConversation", callback);
};

export const onPendingConversation = (callback: (conversation: Conversation) => void) => {
  if (!socket) return;
  socket.off("pendingConversation");
  socket.on("pendingConversation", callback);
};

export const onUserStatusChanged = (callback: (data: UserStatus) => void) => {
  if (!socket) return;
  socket.off("userStatus");
  socket.on("userStatus", callback);
};

export const isSocketConnected = () => socket?.connected ?? false;
export const getSocket = () => socket;