import io from "socket.io-client";
import { Message } from "@/types/message";
import { MessageSend } from "@/types/messageSend";
import { UserStatus } from "@/types/userStatus";
import { IdentificationResponse } from "@/types/chat/identificationResponse";
import { UserChat } from "@/types/chat/userChat";

const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
let clientSocket: ReturnType<typeof io> | null = null;
let advisorSocket: ReturnType<typeof io> | null = null;
let systemSocket: ReturnType<typeof io> | null = null;

const isIdentified: Record<string, boolean> = {
  CLIENT: false,
  BANK_ADVISOR: false,
  SYSTEM: false,
};

let authenticatedUserId: string | null = null;
let authenticatedUserRole: string | null = null;


export const getSocket = (role: string) => {
  if (role === "BANK_ADVISOR") {
    return advisorSocket;
  }
  if (role === "SYSTEM") {
   return systemSocket;
  }
  return clientSocket;
};

export const isSocketConnected = (role?: string) => {
  if (role) return getSocket(role)?.connected ?? false;
  return clientSocket?.connected || advisorSocket?.connected || systemSocket?.connected || false;
};

export const connectSocket = (role: string) => {
  const socket = getSocket(role);
  if (socket?.connected) {
    return;
  }

  const namespace = role === "BANK_ADVISOR" ? "/advisors" : role === "SYSTEM" ? "/system" : "/clients";

  const newSocket = io(`${baseUrl}${namespace}`, {
    withCredentials: true,
    reconnection: true
  });

  if (role === "BANK_ADVISOR") {
    advisorSocket = newSocket;
  } else if (role === "SYSTEM"){
    systemSocket = newSocket;
  } else {
    clientSocket = newSocket;
  } 

  newSocket.on("connect", async () => {
    console.log(`Connected to ${namespace} (${newSocket.id})`);

    if (authenticatedUserId && authenticatedUserRole && !isIdentified[role]) {
      try {
        const identificationRole = role === "SYSTEM" ? authenticatedUserRole : role;

        await identifyUser(authenticatedUserId, identificationRole);
      } catch (err) {
        console.error("Identification failed:", err);
      }
    }
  });

  newSocket.on("connect_error", (err) => {
    console.error(`Connection error (${namespace}):`, err);
  });

  newSocket.on("disconnect", (reason) => {
    console.log(`Disconnected from ${namespace}:`, reason);
    isIdentified[role] = false;
  });
};


export const identifyUser = (userId: string, role: string) => {

  const socket = getSocket(role);
  if (!socket) {
    console.log(`Socket not connected for ${role}, connecting...`);
    connectSocket(role);
    return;
  }

  if (!socket.connected) {
    return;
  }

  if (isIdentified[role]) {
    return;
  }

  authenticatedUserId = userId;
  authenticatedUserRole = role;

  socket.emit("identification", { userId, role }, (response: IdentificationResponse) => {
    if (response.error) {
      console.error("Identification error:", response.error);
    } else {
      isIdentified[role] = true;
    }
  });
};

export const disconnectSocket = (role?: string) => {
  const roles = role ? [role] : ["CLIENT", "BANK_ADVISOR", "SYSTEM"];

  roles.forEach((role) => {
    const socket = getSocket(role);
    if (socket) {
      console.log(`Disconnecting socket for role ${role}`);
      socket.disconnect();
    }
    if (role === "BANK_ADVISOR"){
      advisorSocket = null;
    } else if (role === "SYSTEM"){
      systemSocket = null;
    } else{
      clientSocket = null;
    } 
    
    isIdentified[role] = false;
  });

  if (!role) {
    authenticatedUserId = null;
    authenticatedUserRole = null;
  }
};


export const joinConversation = (conversationId: number, role: string) => {
  const socket = getSocket(role);
  if (!socket?.connected){
    console.warn(`Cannot join conversation: socket ${role} not connected`);
    return;
  }
  socket.emit("joinConversation", conversationId);
};

export const sendMessage = (message: MessageSend, role: string) => {
  const socket = getSocket(role);
  if (!socket?.connected){
    console.error(`Cannot send message: socket ${role} not connected`);
    return;
  }
  socket.emit("message", message);
};


export const onMessageReceived = (role: string, callback: (msg: Message) => void) => {
  const socket = getSocket(role);
  if (!socket) {
    console.warn(`Socket ${role} not available for onMessageReceived`);
    return () => {}; 
  }
    
  socket.on("message", callback);
  
  return () => {
    socket.off("message", callback);
  };
};

export const onPendingConversation = (callback: (conv: UserChat) => void) => {
  const socket = advisorSocket;
  if (!socket) {
    console.warn("⚠️ Advisor socket not available for onPendingConversation");
    return () => {};
  }
  
  socket.off("pendingConversation"); 
  socket.on("pendingConversation", callback);
  
  return () => socket.off("pendingConversation", callback);
};

export const onRemovePendingConversation = (callback: (data: { conversationId: number }) => void) => {
  const socket = advisorSocket;
  if (!socket) {
    console.warn("Advisor socket not available for onRemovePendingConversation");
    return () => {};
  }
  
  socket.off("removePendingConversation");
  socket.on("removePendingConversation", callback);
  
  return () => socket.off("removePendingConversation", callback);
};

export const onConversationAssigned = (callback: (data: UserChat) => void) => {
  const socket = advisorSocket;
  if (!socket) {
    console.warn("Advisor socket not available for onConversationAssigned");
    return () => {};
  }
  
  socket.off("conversationAssigned");
  socket.on("conversationAssigned", callback);
  
  return () => socket.off("conversationAssigned", callback);
};

export const onUserStatusChanged = (callback: (status: UserStatus) => void) => {
  const socket = systemSocket;
  if (!socket) {
    console.warn("System socket not available for onUserStatusChanged");
    return () => {};
  }
  
  socket.off("userStatus");
  socket.on("userStatus", callback);
  
  return () => socket.off("userStatus", callback);
};

export const markMessageAsRead = (messageIds: number[], userId: string) => {
  const socket = systemSocket;
  if (!socket?.connected){
    console.error("Cannot mark as read");
    return;
  }
  socket.emit("markAsRead", { messageIds, userId });
};

export const onMessagesRead = (callback: (ids: number[]) => void) => {
  const socket = systemSocket;
  if (!socket) {
    console.warn("System socket not available for onMessagesRead");
    return () => {};
  }
  
  socket.off("messagesRead");
  socket.on("messagesRead", callback);
  
  return () => socket.off("messagesRead", callback);
};

export const sendTyping = (conversationId: number, userId: string) => {
  const socket = systemSocket;
  if (!socket?.connected){
    console.warn("Cannot send typing");
    return;
  }
  socket.emit("typing", { conversationId, userId });
};

export const sendStopTyping = (conversationId: number, userId: string) => {
  const socket = systemSocket;
  if (!socket?.connected){
    console.warn("Cannot send stopTyping");
    return;
  }
  socket.emit("stopTyping", { conversationId, userId });
};

export const onUserTyping = (callback: (data: { conversationId: number; userId: string }) => void) => {
  const socket = systemSocket;
  if (!socket) {
    console.warn("System socket not available for onUserTyping");
    return () => {};
  }
  
  socket.off("userTyping");
  socket.on("userTyping", callback);
  
  return () => socket.off("userTyping", callback);
};

export const onUserStopTyping = (callback: (data: { conversationId: number; userId: string }) => void) => {
  const socket = systemSocket;
  if (!socket) {
    console.warn("System socket not available for onUserStopTyping");
    return () => {};
  }
  
  socket.off("userStopTyping");
  socket.on("userStopTyping", callback);
  
  return () => socket.off("userStopTyping", callback);
};