import { Server, Socket } from "socket.io";
import { socketMiddleware } from "../middleware/socketMiddleware";
import { groupParticipantMiddleware } from "../middleware/groupParticipantMiddleware";
import { Identification } from "../interfaces/Identification";
import { cryptoUuidGenerator, groupConversationRepository, groupMessageRepository, groupParticipantRepository, userRepository } from "../../../../adapters/config/repositories";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";
import { GetUserGroupsUseCase } from "#application/usecases/group-chat/GetUserGroupsUseCase";
import { GroupMessage } from "../interfaces/GroupMessage";
import { SendGroupMessageUseCase } from "#application/usecases/group-chat/SendGroupMessageUseCase";
import { Typing } from "../interfaces/Typing";

const groupChatUsers: Map<string, Set<string>> = new Map();
const users: Record<string, string[]> = {};


export const groupChatSocket = (io: Server) => {

    const groupChatIo = io.of("/group-chat");

    groupChatIo.use(socketMiddleware);
    groupChatIo.use(groupParticipantMiddleware);

    groupChatIo.on("connection", (socket: Socket) => {
        const user = socket.data.user;
        if (!user.userId) {
            socket.disconnect(true);
            return;
        }

        socket.on("identification", async (data: Identification, callback?: (res: { success?: boolean; error?: string }) => void) => {
            try {
                users[data.userId] = [...(users[data.userId] ?? []), socket.id];
                const getUserGroupsUseCase = new GetUserGroupsUseCase(groupParticipantRepository);

                const userGroups = await getUserGroupsUseCase.execute(user.userId);

                userGroups.forEach((participant) => {
                    const roomName = `group_${participant.groupId}`;
                    socket.join(roomName);

                    if (!groupChatUsers.has(participant.groupId)) {
                        groupChatUsers.set(participant.groupId, new Set());
                    }
                    groupChatUsers.get(participant.groupId)!.add(user.userId);

                    socket.to(roomName).emit("userJoined", {
                        userId: user.userId,
                        role: data.role,
                        isManager: data.role === RoleEnum.BANK_MANAGER
                    });
                });

                socket.emit("userGroups", userGroups);

                callback?.({ success: true });
            } catch (err) {
                callback?.({ error: err instanceof Error ? err.message : "Unknown error" });
            }
        });

        socket.on("joinGroup", async (groupId: string) => {
            const roomName = `group_${groupId}`;
            socket.join(roomName);

            if (!groupChatUsers.has(groupId)) {
                groupChatUsers.set(groupId, new Set());
            }

            groupChatUsers.get(groupId)!.add(user.userId);

            socket.to(roomName).emit("userJoined", {
                userId: user.userId,
                role: user.roles[0],
                isManager: user.roles[0] === RoleEnum.BANK_MANAGER
            });

            socket.emit("onlineUsers", Array.from(groupChatUsers.get(groupId) || []));

        });

        socket.on("sendGroupMessage", async(data: GroupMessage ) => {
            const sendGroupMessageUseCase = new SendGroupMessageUseCase(groupMessageRepository, groupConversationRepository, groupParticipantRepository, userRepository, cryptoUuidGenerator);
            const result = await sendGroupMessageUseCase.execute(data.groupId, user.userId, user.roles[0], data.content);
            if (result instanceof Error) {
                return socket.emit("error", { message: result.message });
            }

            const roomName = `group_${data.groupId}`;
            groupChatIo.to(roomName).emit("newGroupMessage", {...result,isManager: result.senderRole === RoleEnum.BANK_MANAGER});
        });

        socket.on("typing", (data: Typing) => {
            const roomName = `group_${data.groupId}`;
            socket.to(roomName).emit("userTyping", {
                userId: data.userId,
                firstName: data.firstName,
                lastName: data.lastName,
                isManager: data.isManager
            });
        });

        socket.on("stopTyping", (data: Typing) => {
            const roomName = `group_${data.groupId}`;
            socket.to(roomName).emit("userStopTyping", {
                userId: data.userId
            });
        });

        socket.on("leavingChatGroup", (groupId: string) => {
            const roomName = `group_${groupId}`;
            socket.leave(roomName);

            if (groupChatUsers.has(groupId)) {
                groupChatUsers.get(groupId)!.delete(user.userId);
            }
            groupChatIo.to(roomName).emit("userLeft", {
                userId: user.userId
            });
        });

        socket.on("disconnect", () => {
            users[user.userId] = (users[user.userId] ?? []).filter(id => id !== socket.id);
            groupChatUsers.forEach((userSet, groupId) => {
                if (userSet.has(user.userId)) {
                    userSet.delete(user.userId);
                    const roomName = `group_${groupId}`;
                    groupChatIo.to(roomName).emit("userLeft", {
                        userId: user.userId
                    });
                }
            });
        });




    })

}