import { GroupConversation } from "@/types/groupConversation";
import { GroupMessage } from "@/types/groupMessage";
import { Typing } from "@/types/typing";
import { io, Socket } from "socket.io-client";

const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
let groupSocket: Socket | null = null;

let isIdentified = false;
let authenticatedUserId: string | null = null;
let authenticatedUserRole: string | null = null;

export const getGroupSocket = (): Socket | null => groupSocket;

export const isGroupSocketConnected = (): boolean => {
    return groupSocket?.connected ?? false;
}

export const connectedToGroupChat = (): void => {
    if (groupSocket?.connected) {
        return;
    }

    groupSocket = io(`${baseUrl}/group-chat`, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

 groupSocket.on("connect", async () => {
        if (authenticatedUserId && authenticatedUserRole && !isIdentified) {
            try {
                await identifyUser(authenticatedUserId, authenticatedUserRole);
            } catch (err) {
                console.error("Group chat identification failed:", err);
            }
        }
    });


    groupSocket.on("disconnect", () => {
        isIdentified = false;
    });

};


export const identifyUser = async (userId: string, role: string):Promise<void> => {
    return new Promise((resolve, reject) => {
        if(!groupSocket) {
            connectedToGroupChat();
            resolve();
            return;
        }
        if(!groupSocket.connected) {
            resolve();
            return;
        }

        if(isIdentified) {
            resolve();
            return;
        }

        authenticatedUserId = userId;
        authenticatedUserRole = role;

        groupSocket.emit("identification", { userId, role }, (response: { success?: boolean; error?: string }) => {
            if (response.error) {
                reject(new Error(response.error));
            } else {
                isIdentified = true;
                resolve();
            }
        });
    });
};

export const joinedGroupChat = (groupId: string): void => {
    if(!groupSocket) {
        return;
    }
    groupSocket.emit("joinGroup", groupId);
}

export const leftGroupChat = (groupId: string): void => {
    if(!groupSocket) {
        return;
    }
    groupSocket.emit("leavingChatGroup", groupId);
}

export const sendMessagesInGroup = (groupId: string, content: string): void => {
    if(!groupSocket) {
        return;
    }
    groupSocket.emit("sendGroupMessage", {groupId, content});
};

export const startTyping = (groupId: string, data: Typing) : void => {
    if(!groupSocket) {
        return;
    }
    groupSocket.emit("typing", { groupId, ...data });
};

export const stopTyping = (groupId: string, userId: string) : void => {
    if(!groupSocket) {
        return;
    }
    groupSocket.emit("stopTyping", { groupId, userId });
};


export const onUserGroups =(callback: (groups: GroupConversation[]) => void): (() => void) => {
    if(!groupSocket) {
        return () => {};
    }
    groupSocket.on("userGroups", callback);
    return () => groupSocket?.off("userGroups", callback);
};

export const onNewGroupMessage = (callback: (message: GroupMessage) => void): (() => void) => {
    if(!groupSocket) {
        return () => {};
    }
    groupSocket.on("newGroupMessage", callback);
    return () => groupSocket?.off("newGroupMessage", callback);
};

export const onUserTyping = (callback: (data: Typing) => void): (() => void) => {
    if(!groupSocket) {
        return () => {};
    }
    groupSocket.on("userTyping", callback); 
    return () => groupSocket?.off("userTyping", callback);
}

export const onUserStopTyping = (callback: (data: { userId: string }) => void): (() => void) => {
    if(!groupSocket) {
        return () => {};
    }
    groupSocket.on("userStopTyping", callback);
    return () => groupSocket?.off("userStopTyping", callback);
};

export const onUserJoinedGroup = (callback: (data: { userId: string; role: string; isManager: boolean }) => void): (() => void) => {
    if(!groupSocket) {
        return () => {};
    }
    groupSocket.on("userJoined", callback);
    return () => groupSocket?.off("userJoined", callback);
};

export const onOnlineUsers = (callback: (userIds: string[]) => void): (() => void) => {
    if(!groupSocket) {
        return () => {};
    }   
    groupSocket.on("onlineUsers", callback);
    return () => groupSocket?.off("onlineUsers", callback);
};

export const onUserLeftGroup = (callback: (data: { userId: string }) => void): (() => void) => {
    if(!groupSocket) {
        return () => {};
    }
    groupSocket.on("userLeft", callback);
    return () => groupSocket?.off("userLeft", callback);
};  
