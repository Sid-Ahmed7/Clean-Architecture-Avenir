import { io } from "socket.io-client";

export const getSocket = (role: string, userSocket:  ReturnType<typeof io> | null = null) => {
  if (role === "BANK_ADVISOR") {
    return userSocket;
  }
  if (role === "SYSTEM") {
   return userSocket;
  }
  return userSocket;
};