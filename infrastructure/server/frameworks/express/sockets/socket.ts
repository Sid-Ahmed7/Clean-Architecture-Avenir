import { Server } from "socket.io";
import { SendMessageUseCase } from "../../../../../application/usecases/chat/SendMessageUseCase";
import { socketMiddleware } from "../middleware/socketMiddleware";
import { AssignAdvisorToConversationUseCase } from "../../../../../application/usecases/chat/AssignAdvisorToConversationUseCase";
import { GetUnreadMessagesUseCase } from "../../../../../application/usecases/chat/GetUnreadMessagesUseCase";

import { OnlineUser } from "../interfaces/OnlineUser";
import { Message } from "../interfaces/Message";
import { AdvisorAlreadyAssignedError } from "../../../../../application/errors/chat/AdvisorAlreadyAssignedError";
import { ConversationEntity } from "../../../../../domain/entities/ConversationEntity";
import { conversationRepository, messageRepository, userRepository, roleRepository } from "../../../../adapters/config/repositories";
import { MarkMessageAsReadUseCase } from "../../../../../application/usecases/chat/MarkMessageAsReadUseCase";
import { MessageEntity } from "../../../../../domain/entities/MessageEntity";

export const clients: Record<string, string[]> = {};
export const onlineUsers: Record<string, OnlineUser> = {};
export let io: Server;

export const socketSetup = (server: Server) => {
  io = server;
  io.use(socketMiddleware);

  io.on("connection", (socket) => {
    const user = socket.data.user;

    if (!user?.userId) {
      console.warn("Socket non authentifié, déconnexion :", socket.id);
      return socket.disconnect();
    }

    console.log(`Socket connecté: ${socket.id}, userId: ${user.userId}`);

    socket.on("identification", async (_data: any, callback?: Function) => {
      const role = user.role;

      clients[user.userId] = [...(clients[user.userId] ?? []), socket.id];
      onlineUsers[user.userId] = { isOnline: true, role };
      io.emit("userStatus", { userId: user.userId, isOnline: true, role });


      console.log("Identification réussie pour:", user.userId, "role:", role);

      const getUnreadMessagesUseCase = new GetUnreadMessagesUseCase(messageRepository)
      const unreadIds = await getUnreadMessagesUseCase.execute(user.userId);
      if (unreadIds.length > 0) {
        const userSockets = clients[user.userId] || [];
        userSockets.forEach(socketId => io.to(socketId).emit("messagesRead", unreadIds));
    
  }



      if (role === "BANK_ADVISOR") {
        const allConversations = await conversationRepository.findAll();
        const pendingConversations = allConversations.filter(
          (c) => !c.advisorId || c.advisorId === ""
        );

        pendingConversations.forEach((c) => {
          io.to(socket.id).emit("pendingConversation", {
            id: c.id,
            clientId: c.clientId,
            advisorId: c.advisorId,
            createdAt: c.createdAt,
          });
          console.log(`Pending conversation envoyée au conseiller: ${c.id}`);
        });
      }

      if (typeof callback === "function") {
        callback({ success: true });
      }
    });

    socket.on("joinConversation", (conversationId: number) => {
      if (conversationId == null) return;
      socket.join(conversationId.toString());
      console.log(`Socket ${socket.id} rejoint conversation ${conversationId}`);
    });


    socket.on("message", async (data: Message, callback?: Function) => {
      console.log("Message reçu:", data);

      if (!data?.userId || !data.conversationId || !data.content) {
        if (typeof callback === "function") callback({ error: "Incomplete message data" });
        return;
      }

      try {

        const targetConversationId = data.conversationId;
        let isAssigned = false;
        
        if(data.role === "BANK_ADVISOR") {
          const assignAdvisorUseCase = new AssignAdvisorToConversationUseCase(conversationRepository);
          const result = await assignAdvisorUseCase.execute(targetConversationId,data.userId);
          if (result instanceof Error) {
            if (result instanceof AdvisorAlreadyAssignedError) {
              console.warn(`Conversation ${targetConversationId} déjà assignée`);
              if (typeof callback === "function") {
                callback({ error: "Cette conversation est déjà prise en charge par un autre conseiller" });
              }
              return;
            }
            
            if (typeof callback === "function") {
              callback({ error: result.message });
            }
            return;
          }
          isAssigned = true;
          console.log(`Conversation ${targetConversationId} assignée au conseiller ${data.userId}`);
        }
        const sendMessageUseCase = new SendMessageUseCase(conversationRepository, messageRepository);
      
        const message = await sendMessageUseCase.execute(
          data.userId,
          data.role,
          data.conversationId,
          data.content
        );

        if (message instanceof Error) {
          console.error("Échec création message:", message.message);
          if (typeof callback === "function") callback({ error: message.message });
          return;
        }

        if (isAssigned) {
          const assignedSockets = clients[data.userId] || [];
          assignedSockets.forEach(socketId => {
            io.to(socketId).emit("conversationAssigned", {
              conversationId: targetConversationId,
              advisorId: data.userId,
            });
          });

          Object.keys(clients).forEach(userId => {
            if (userId !== data.userId && onlineUsers[userId]?.role === "BANK_ADVISOR") {
              const sockets = clients[userId] || [];
              sockets.forEach(socketId => {
                io.to(socketId).emit("removePendingConversation", {
                  conversationId: targetConversationId
                });
              });
            }
          });

          console.log(`Notifications envoyées pour conversation ${targetConversationId}`);
        }
        if (data.role === "CLIENT" && !message.conversationAdvisorId) {
          const conversation = await conversationRepository.findByConversationId(targetConversationId);
          
          if (conversation instanceof ConversationEntity) {
            const pendingData = {
              id: conversation.id,
              clientId: conversation.clientId,
              advisorId: conversation.advisorId,
              createdAt: conversation.createdAt,
            };

            Object.keys(clients).forEach((userId) => {
              if (onlineUsers[userId]?.role === "BANK_ADVISOR") {
                const sockets = clients[userId] || [];
                sockets.forEach((socketId) => {
                  io.to(socketId).emit("pendingConversation", pendingData);
                });
              }
            });
            
            console.log(`Pending conversation ${targetConversationId} broadcast aux conseillers`);
          }
        }

        const advisorSockets = message.conversationAdvisorId
          ? clients[message.conversationAdvisorId] || []
          : [];
        const clientSockets = message.conversationClientId
          ? clients[message.conversationClientId] || []
          : [];

        const allSockets = [...advisorSockets, ...clientSockets].filter(id => id !== socket.id);

        allSockets.forEach((socketId) => {
          io.to(socketId).emit("message", message);
        });

        console.log(`Message broadcast à ${allSockets.length} sockets`);

        if (typeof callback === "function") {
          callback({ success: true, message });
        }

      } catch (err) {
        console.error("[Socket] Erreur:", err);
        if (typeof callback === "function") {
          callback({ error: err instanceof Error ? err.message : "Unknown error" });
        }
      }
    });

    socket.on("typing", (data:{conversationId: number; userId:string}) => {
      
      if(data.conversationId != null) {
      socket.to(data.conversationId.toString()).emit("userTyping", data);
      }
    });

    socket.on("stopTyping", (data:{conversationId: number; userId:string}) => {
      if(data.conversationId != null) {

        socket.to(data.conversationId.toString()).emit("userStopTyping", data);
      }

      });

 socket.on("markAsRead", async (data: { messageIds: number[]; userId: string }) => {
  const markAsRead = new MarkMessageAsReadUseCase(messageRepository);
  const authorsToNotify = new Map<string, number[]>(); 

  for (const id of data.messageIds) {
    const message = await messageRepository.findById(id);
    if (message instanceof MessageEntity) {
      if (message.authorId !== data.userId) {
        await markAsRead.execute(message);
        if (!authorsToNotify.has(message.authorId)) authorsToNotify.set(message.authorId, []);
        authorsToNotify.get(message.authorId)!.push(message.id);
      }
    }
  }

 authorsToNotify.forEach((ids, authorId) => {
    const sockets = clients[authorId] || [];
    if (sockets.length > 0) {
      sockets.forEach(socketId => io.to(socketId).emit("messagesRead", ids));
    } 
  });
});




    socket.on("disconnect", () => {
      console.log(`Socket déconnecté: ${socket.id}`);
      const userId = user.userId;
      if (!userId) return;

      clients[userId] = (clients[userId] ?? []).filter((id) => id !== socket.id);
      const currentUser = onlineUsers[userId];
      if (!clients[userId]?.length && currentUser) {
        currentUser.isOnline = false;
        io.emit("userStatus", { userId, isOnline: false });
      }
    });
  });
};
