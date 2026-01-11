import { Server } from "socket.io";
import { SendMessageUseCase } from "../../../../../application/usecases/chat/SendMessageUseCase";
import { AssignAdvisorToConversationUseCase } from "../../../../../application/usecases/chat/AssignAdvisorToConversationUseCase";
import { GetUnreadMessagesUseCase } from "../../../../../application/usecases/chat/GetUnreadMessagesUseCase";
import { MarkMessageAsReadUseCase } from "../../../../../application/usecases/chat/MarkMessageAsReadUseCase";
import { socketMiddleware } from "../middleware/socketMiddleware";
import { OnlineUser } from "../interfaces/OnlineUser";
import { Message } from "../interfaces/Message";
import { MessageEntity } from "../../../../../domain/entities/MessageEntity";
import { ConversationEntity } from "../../../../../domain/entities/ConversationEntity";
import { conversationRepository, messageRepository, notificationRepository, userRepository } from "../../../../adapters/config/repositories";
import { uuidService, notificationService } from "../../../../adapters/config/services";
import { Identification } from "../interfaces/Identification";
import { Data } from "../interfaces/Data";
import { SendNotificationToClientUseCase } from "../../../../../application/usecases/notification/SendNotificationToClientUseCase";
import { sendNotificationToClientSchema } from "../schemas/notifications/sendNotificationToClientSchema";


export const clients: Record<string, string[]> = {};
export const onlineUsers: Record<string, OnlineUser> = {};
export let io: Server;

export const socketSetup = (server: Server) => {
  io = server;

  const clientIo = io.of("/clients");
  const advisorIo = io.of("/advisors");
  const systemIo = io.of("/system");

  clientIo.use(socketMiddleware);
  advisorIo.use(socketMiddleware);
  systemIo.use(socketMiddleware);

  const broadCastToAll = (userId: string, isOnline: boolean, role?: string) => {
    const statusData = { userId, isOnline, role };
    clientIo.emit("userStatus", statusData);
    advisorIo.emit("userStatus", statusData);
    systemIo.emit("userStatus", statusData);
  };

  const broadcastMessage = (message: MessageEntity, conversationId: string) => {
    const roomName = `conversation_${conversationId}`;
    clientIo.to(roomName).emit("message", message);
    advisorIo.to(roomName).emit("message", message);
    systemIo.to(roomName).emit("message", message);
  };

  const broadcastTyping = (currentSocketId: string,conversationId: string,userId: string,isTyping: boolean) => {
    const roomName = `conversation_${conversationId}`;
    const event = isTyping ? "userTyping" : "userStopTyping";
    const data = { conversationId, userId };
    [clientIo, advisorIo, systemIo].forEach(namespace => {
      namespace.to(roomName).emit(event, data);
    });
  };

  // ---------------- CLIENT ----------------
  clientIo.on("connection", (socket) => {
    const user = socket.data.user;
    if (!user?.userId) {
      return socket.disconnect();
    }


    socket.on("identification", async (data: Identification, callback?: (res: { success?: boolean; error?: string }) => void) => {
      try {
        const role = data.role;
        clients[data.userId] = [...(clients[data.userId] ?? []), socket.id];
        onlineUsers[data.userId] = { isOnline: true, role };
        broadCastToAll(data.userId, true, role);

        
        const clientConversation = await conversationRepository.findByClientId(data.userId);
        if (Array.isArray(clientConversation)) {
          clientConversation.forEach((conv) => {
            const roomName = `conversation_${conv.id}`;
            socket.join(roomName);
            socket.emit("conversationAssigned", conv);
            
            if (conv.advisorId && clients[conv.advisorId]) {
              clients[conv.advisorId]?.forEach((advisorSocketId) =>
                advisorIo.to(advisorSocketId).emit("conversationAssigned", conv)
              );
            }
          });
        }

        const unreadUseCase = new GetUnreadMessagesUseCase(messageRepository);
        const unreadIds = await unreadUseCase.execute(data.userId);
        if (unreadIds.length > 0) {
          socket.emit("messagesRead", unreadIds);
        }
        callback?.({ success: true });
      } catch (err) {
        console.error("Serveur: Erreur identification client -", err);
        callback?.({ error: err instanceof Error ? err.message : "Unknown error" });
      }
    });

    socket.on("joinConversation", (conversationId: string) => {
      if (conversationId != null) {
        const roomName = `conversation_${conversationId}`;
        socket.join(roomName);
      }
    });

    socket.on("message", async (data: Message) => {
      try {
            const sendNotificationUseCase = new SendNotificationToClientUseCase(notificationRepository,notificationService,uuidService,userRepository);
        const sendMessageUseCase = new SendMessageUseCase(conversationRepository, messageRepository, uuidService, sendNotificationUseCase);
        const message = await sendMessageUseCase.execute(data.userId, data.role, data.conversationId, data.content);
        
        if (!(message instanceof MessageEntity)) {
          return;
        }

        broadcastMessage(message, data.conversationId);

      } catch (err) {
        console.error("Erreur envoi message client -", err);
      }
    });

    socket.on("typing", (data: Data) => {
      broadcastTyping(socket.id, data.conversationId, data.userId, true);
    });

    socket.on("stopTyping", (data: Data) => {
      broadcastTyping(socket.id, data.conversationId, data.userId, false);
    });

    socket.on("disconnect", () => {
      clients[user.userId] = (clients[user.userId] ?? []).filter((id) => id !== socket.id);
      if (!clients[user.userId]?.length) {
        const userData = onlineUsers[user.userId];
        if (userData){
          userData.isOnline = false;
        } 
        broadCastToAll(user.userId, false);
      }
    });
  });

  // ---------------- ADVISOR ----------------
  advisorIo.on("connection", (socket) => {
    const user = socket.data.user;
    if (!user?.userId) return socket.disconnect();


    socket.on("identification", async (data: Identification, callback?: (res: { success?: boolean; error?: string }) => void) => {
      try {
        const role = data.role;
        clients[data.userId] = [...(clients[data.userId] ?? []), socket.id];
        onlineUsers[data.userId] = { isOnline: true, role };
        broadCastToAll(data.userId, true, role);

        const allConversations = await conversationRepository.findAll();
        const pending = allConversations.filter((c) => !c.advisorId);
        pending.forEach((c) => socket.emit("pendingConversation", c));

        const assignedConversations = allConversations.filter((conversation) => conversation.advisorId === data.userId)
        assignedConversations.forEach((conversation) => {
          const roomName = `conversation_${conversation.id}`;
          socket.join(roomName);
          socket.emit("conversationAssigned", conversation);
        });
        callback?.({ success: true });
      } catch (err) {
        callback?.({ error: err instanceof Error ? err.message : "Unknown error" });
      }
    });

    socket.on("message", async (data: Message) => {
      try {
        const conversation = await conversationRepository.findByConversationId(data.conversationId);
        if(conversation instanceof Error){
          return;
        }

        if (conversation && !conversation.advisorId) {

          const sendNotificationUseCase = new SendNotificationToClientUseCase(
            notificationRepository,
            notificationService,
            uuidService,
            userRepository
          );
          const assignUseCase = new AssignAdvisorToConversationUseCase(conversationRepository, sendNotificationUseCase);
          const mess = await assignUseCase.execute(data.conversationId, data.userId);

          const roomName = `conversation_${data.conversationId}`;
          socket.join(roomName);
          
          advisorIo.emit("removePendingConversation", { conversationId: data.conversationId });

          const updatedConversation = await conversationRepository.findByConversationId(data.conversationId);

          if (updatedConversation instanceof ConversationEntity) {
            socket.emit("conversationAssigned", updatedConversation);

            if(updatedConversation.clientId && clients[updatedConversation.clientId]){
              clients[updatedConversation.clientId]?.forEach((clientSocketId) =>
                clientIo.to(clientSocketId).emit("conversationAssigned", updatedConversation)
  
            );
            }
          }
        }
            const sendNotificationUseCase = new SendNotificationToClientUseCase(notificationRepository,notificationService,uuidService,userRepository);
        const sendMessageUseCase = new SendMessageUseCase(conversationRepository, messageRepository, uuidService, sendNotificationUseCase);

        const message = await sendMessageUseCase.execute(data.userId, data.role, data.conversationId, data.content);

        if (!(message instanceof MessageEntity)) {
          return;
        }

        broadcastMessage(message, data.conversationId);
        
      } catch (err) {
        console.error("Erreur envoi message conseiller -", err);
      }
    });

    socket.on("typing", (data: Data) => {
      broadcastTyping(socket.id, data.conversationId, data.userId, true);
    });

    socket.on("stopTyping", (data: Data) => {
      broadcastTyping(socket.id, data.conversationId, data.userId, false);
    });

    socket.on("disconnect", () => {
      clients[user.userId] = (clients[user.userId] ?? []).filter((id) => id !== socket.id);
      if (!clients[user.userId]?.length) {
        const userData = onlineUsers[user.userId];
        if (userData) userData.isOnline = false;
        broadCastToAll(user.userId, false);
      }
    });
  });

  // ---------------- SYSTEM ----------------
  systemIo.on("connection", (socket) => {
    const user = socket.data.user;
    if (!user?.userId){
      return socket.disconnect();
    } 
    
    
    socket.on("identification", async (data: Identification, callback?: (res: { success?: boolean; error?: string }) => void) => {
      try {
        clients[`${data.userId}_system`] = [...(clients[`${data.userId}_system`] ?? []), socket.id];
        
        callback?.({ success: true });
      } catch (err) {
        callback?.({ error: err instanceof Error ? err.message : "Unknown error" });
      }
    });

    socket.on("joinConversation", (conversationId: string) => {
      if (conversationId != null) {
        const roomName = `conversation_${conversationId}`;
        socket.join(roomName);
      }
    });

    socket.on("typing", (data: Data) => {
      broadcastTyping(socket.id, data.conversationId, data.userId, true);
    });

    socket.on("stopTyping", (data: Data) => {
      broadcastTyping(socket.id, data.conversationId, data.userId, false);
    });

    socket.on("markAsRead", async (data: { messageIds: string[]; userId: string }) => {
      const markAsRead = new MarkMessageAsReadUseCase(messageRepository);
      const authorsToNotify = new Map<string, string[]>();

      for (const id of data.messageIds) {
        const message = await messageRepository.findById(id);
        if (message instanceof MessageEntity && message.authorId !== data.userId) {
          await markAsRead.execute(message);
          if (!authorsToNotify.has(message.authorId)) authorsToNotify.set(message.authorId, []);
          authorsToNotify.get(message.authorId)!.push(message.id);
        }
      }

      authorsToNotify.forEach((ids, authorId) => {
        const sockets = clients[authorId] || [];
        sockets.forEach((socketId) => {
          const userRole = onlineUsers[authorId]?.role;
          if (userRole === "BANK_ADVISOR") {
            advisorIo.to(socketId).emit("messagesRead", ids);
          } else {
            clientIo.to(socketId).emit("messagesRead", ids);
          }
        });

        const systemSockets = clients[`${authorId}_system`] || [];
        systemSockets.forEach((socketId) => {
          systemIo.to(socketId).emit("messagesRead", ids);
        });
      });

    });

    socket.on("disconnect", () => {
      clients[`${user.userId}_system`] = (clients[`${user.userId}_system`] ?? []).filter((id) => id !== socket.id);
    });
    
  });
  
};