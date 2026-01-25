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
    participantsCount: number;
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
    | { type: "SET_PARTICIPANTS_COUNT"; payload: number }
    | { type: "INCREMENT_PARTICIPANTS_COUNT" }
    | { type: "DECREMENT_PARTICIPANTS_COUNT" }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null };

const initialState: State = {
    messages: [],
    participants: [],
    participantsCount: 0,
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
        case "SET_PARTICIPANTS_COUNT":
            return { ...state, participantsCount: action.payload };
        case "INCREMENT_PARTICIPANTS_COUNT":
            return { ...state, participantsCount: state.participantsCount + 1 };
        case "DECREMENT_PARTICIPANTS_COUNT":
            return { ...state, participantsCount: state.participantsCount - 1 };
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
        let hasInitialized = false;

        const initialize = async () => {
            if (hasInitialized || !isMounted) return;
            hasInitialized = true;

            try {
                await groupChatService.identifyUser(userId, role);
                groupChatService.joinedGroupChat(groupId);

                dispatch({ type: "SET_CONNECTED", payload: true });

                const [messages, participants] = await Promise.all([
                    getGroupMessages(groupId),
                    getGroupParticipants(groupId)
                ]);

                if (!isMounted) return;

                dispatch({ type: "SET_MESSAGES", payload: messages });
                dispatch({ type: "SET_PARTICIPANTS", payload: participants });
                dispatch({ type: "SET_PARTICIPANTS_COUNT", payload: participants.length });
                dispatch({ type: "SET_LOADING", payload: false });
            } catch {
                if (!isMounted) return;
                dispatch({ type: "SET_ERROR", payload: "Erreur de connexion au chat" });
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };

        groupChatService.connectedToGroupChat();
        const socket = groupChatService.getGroupSocket();

        if (!socket) {
            dispatch({ type: "SET_ERROR", payload: "Impossible de se connecter au serveur" });
            dispatch({ type: "SET_LOADING", payload: false });
            return;
        }

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
            dispatch({ type: "INCREMENT_PARTICIPANTS_COUNT" });
        };

        const handleUserLeft = (data: { userId: string }) => {
            dispatch({ type: "REMOVE_ONLINE_USER", payload: data.userId });
            dispatch({ type: "DECREMENT_PARTICIPANTS_COUNT" });
        };

        const handleOnlineUsers = (users: string[]) => {
            dispatch({ type: "SET_ONLINE_USERS", payload: users });
        };

        socket.on("connect", initialize);
        socket.on("disconnect", () => {
            dispatch({ type: "SET_CONNECTED", payload: false });
        });

        if (socket.connected) {
            initialize();
        }

        const cleanupMessage = groupChatService.onNewGroupMessage(handleMessage);
        const cleanupTyping = groupChatService.onUserTyping(handleTyping);
        const cleanupStopTyping = groupChatService.onUserStopTyping(handleStopTyping);
        const cleanupJoined = groupChatService.onUserJoinedGroup(handleUserJoined);
        const cleanupLeft = groupChatService.onUserLeftGroup(handleUserLeft);
        const cleanupOnline = groupChatService.onOnlineUsers(handleOnlineUsers);

        return () => {
            isMounted = false;
            socket.off("connect", initialize);

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
