import {Server } from "socket.io";
import {SendMessageUseCase} from "../../../../../application/usecases/chat/SendMessageUseCase";
import {InMemoryConversationRepository} from "../../../../adapters/repositories/InMemoryConversationRepository";
import {InMemoryMessageRepository} from "../../../../adapters/repositories/InMemoryMessageRepository";
import { socketMiddleware } from "../middleware/socketMiddleware";
import { MessageEntity } from "../../../../../domain/entities/MessageEntity.";

interface Message {
    userId: string;
    role: string;
    conversationId: number;
    content: string;
};

const conversationRepository = new InMemoryConversationRepository();
const messageRepository = new InMemoryMessageRepository();


export const socketSetup = (io: Server) => {
    const clients: Record<string, string[]> = {};
    const onlineUsers: Record<string, boolean> = {};

    io.use(socketMiddleware);

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        const user = socket.data.user;

        socket.on("identification", (data: {userId: string, role:string}) => {
            if (data.userId !== user.id) {
                return socket.emit("error", "Invalid identification");
            } 

            clients[user.id] = [...(clients[user.id] ?? []), socket.id];
            onlineUsers[user.id] = true;
            io.emit("userStatus", {userId: user.id, isOnline: true})
     
        });

        socket.on("joinConversation", async (conversationId: number) => {
            socket.join(conversationId.toString())
        })

        socket.on("messages", async (data: Message) => {
            const sendMessageUseCase = new SendMessageUseCase(conversationRepository, messageRepository);
            const message = await sendMessageUseCase.execute(data.userId, data.role, data.conversationId, data.content);

            if(message instanceof MessageEntity) {
                const advisorSockets = clients[message.conversationAdvisorId];
                const clientSockets = clients[message.conversationClientId];
                advisorSockets?.forEach((socketId) => io.to(socketId).emit("message", message));
                clientSockets?.forEach((socketId) => io.to(socketId).emit("message", message));

            }
        });

        socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        clients[user.id] = (clients[user.id] ?? []).filter((id) => id !== socket.id);

            if (!clients[user.id]?.length) {
                onlineUsers[user.id] = false;
                io.emit("userStatus", { userId: user.id, isOnline: false });
            }
        });
    });
};