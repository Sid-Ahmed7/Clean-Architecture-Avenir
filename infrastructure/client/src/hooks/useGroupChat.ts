import { useReducer, useEffect, useCallback } from "react";
import * as groupChatService from "@/services/groupChatService";
import { getGroupMessages, getGroupParticipants } from "@/lib/api/groupChat";
import { GroupMessage } from "@/types/groupMessage";
import { GroupParticipant } from "@/types/groupParticipant";
import { RoleEnum } from "@/types/RoleEnum";
import { Typing } from "@/types/typing";

type State = {
    messages: GroupMessage[];
    participants: GroupParticipant[];
    typingUsers: Typing[];
    onlineUsers: string[];
    connected: boolean;
    isLoading: boolean;
    error: string | null;
};

type Action =
    | { type: "SET_CONNECTED"; payload: boolean }
    | { type: "SET_MESSAGES"; payload: GroupMessage[] }
    | { type: "ADD_MESSAGE"; payload: GroupMessage }
    | { type: "SET_PARTICIPANTS"; payload: GroupParticipant[] }
    | { type: "USER_TYPING"; payload: Typing }
    | { type: "USER_STOP_TYPING"; payload: string }
    | { type: "SET_ONLINE_USERS"; payload: string[] }
    | { type: "ADD_ONLINE_USER"; payload: string }
    | { type: "REMOVE_ONLINE_USER"; payload: string }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null };

const initialState: State = {
    messages: [],
    participants: [],
    typingUsers: [],
    onlineUsers: [],
    connected: false,
    isLoading: true,
    error: null
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_CONNECTED":
            return { ...state, connected: action.payload };
        case "SET_MESSAGES":
            return { ...state, messages: action.payload };
        case "ADD_MESSAGE":
            if (state.messages.some(m => m.id === action.payload.id)) return state;
            return { ...state, messages: [...state.messages, action.payload] };
        case "SET_PARTICIPANTS":
            return { ...state, participants: action.payload };
        case "USER_TYPING":
            return {
                ...state,
                typingUsers: [...state.typingUsers.filter(u => u.userId !== action.payload.userId), action.payload]
            };
        case "USER_STOP_TYPING":
            return { ...state, typingUsers: state.typingUsers.filter(u => u.userId !== action.payload) };
        case "SET_ONLINE_USERS":
            return { ...state, onlineUsers: action.payload };
        case "ADD_ONLINE_USER":
            if (state.onlineUsers.includes(action.payload)) return state;
            return { ...state, onlineUsers: [...state.onlineUsers, action.payload] };
        case "REMOVE_ONLINE_USER":
            return { ...state, onlineUsers: state.onlineUsers.filter(id => id !== action.payload) };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

export const useGroupChat = (groupId: string, userId: string, role: RoleEnum) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        let isMounted = true;

        groupChatService.connectedToGroupChat();

        const socket = groupChatService.getGroupSocket();

        if (!socket) {
            return;
        }

        const handleConnect = async () => {
            if (!isMounted) return;

            await groupChatService.identifyUser(userId, role);
            groupChatService.joinedGroupChat(groupId);

            dispatch({ type: "SET_CONNECTED", payload: true });

            getGroupMessages(groupId).then(messages => {
                if (!isMounted) return;
                dispatch({ type: "SET_MESSAGES", payload: messages });
            });

            getGroupParticipants(groupId).then(participants => {
                if (!isMounted) return;
                dispatch({ type: "SET_PARTICIPANTS", payload: participants });
            });

            dispatch({ type: "SET_LOADING", payload: false });
        };

        const handleMessage = (msg: GroupMessage) => {
            if (msg.groupId === groupId) {
                dispatch({ type: "ADD_MESSAGE", payload: msg });
                dispatch({ type: "USER_STOP_TYPING", payload: msg.senderId });
            }
        };

        const handleTyping = (data: Typing) => {
            if (data.userId !== userId) {
                dispatch({ type: "USER_TYPING", payload: data });
            }
        };

        const handleStopTyping = (data: { userId: string }) => {
            dispatch({ type: "USER_STOP_TYPING", payload: data.userId });
        };

        const handleUserJoined = (data: { userId: string }) => {
            dispatch({ type: "ADD_ONLINE_USER", payload: data.userId });
        };

        const handleUserLeft = (data: { userId: string }) => {
            dispatch({ type: "REMOVE_ONLINE_USER", payload: data.userId });
        };

        const handleOnlineUsers = (users: string[]) => {
            dispatch({ type: "SET_ONLINE_USERS", payload: users });
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", () => {
            dispatch({ type: "SET_CONNECTED", payload: false });
        });

        const cleanupMessage = groupChatService.onNewGroupMessage(handleMessage);
        const cleanupTyping = groupChatService.onUserTyping(handleTyping);
        const cleanupStopTyping = groupChatService.onUserStopTyping(handleStopTyping);
        const cleanupJoined = groupChatService.onUserJoinedGroup(handleUserJoined);
        const cleanupLeft = groupChatService.onUserLeftGroup(handleUserLeft);
        const cleanupOnline = groupChatService.onOnlineUsers(handleOnlineUsers);

        return () => {
            isMounted = false;

            cleanupMessage?.();
            cleanupTyping?.();
            cleanupStopTyping?.();
            cleanupJoined?.();
            cleanupLeft?.();
            cleanupOnline?.();

            groupChatService.leftGroupChat(groupId);
            dispatch({ type: "SET_CONNECTED", payload: false });
        };
    }, [groupId, userId, role]);

    const sendMessage = useCallback((content: string) => {
        groupChatService.sendMessagesInGroup(groupId, content);
    }, [groupId]);

    const startTyping = useCallback((data: Typing) => {
        groupChatService.startTyping(groupId, data);
    }, [groupId]);

    const stopTyping = useCallback(() => {
        groupChatService.stopTyping(groupId, userId);
    }, [groupId, userId]);

    return {
        ...state,
        sendMessage,
        startTyping,
        stopTyping
    };
};
