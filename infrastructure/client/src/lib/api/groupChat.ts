import { GroupConversation } from "@/types/groupConversation";
import { apiClient } from "./apiClient";
import { GroupParticipant } from "@/types/groupParticipant";
import { GroupMessage } from "@/types/groupMessage";

export const createGroupConversation = async (name: string) :Promise<GroupConversation> => {
    const {data} = await apiClient.post('/group-chat/create', { name });
    return data;    
}

export const joinGroupConversation = async (groupId: string) :Promise<GroupParticipant> => {
    const {data} = await apiClient.post(`/group-chat/${groupId}/join`);
    return data;
}


export const getGroupMessages = async (groupId: string,limit: number = 50,offset: number = 0): Promise<GroupMessage[]> => {
    const { data } = await apiClient.get(`/group-chat/${groupId}/messages`, {params: { limit, offset }
    });
    return data;
};

export const getGroupParticipants = async (groupId: string): Promise<GroupParticipant[]> => {
    const { data } = await apiClient.get(`/group-chat/${groupId}/participants`);
    return data;
}

export const getAllGroups = async (): Promise<GroupConversation[]> => {
    const { data } = await apiClient.get('/group-chat');
    return data;
}

export const sendGroupMessage = async (groupId: string, content: string): Promise<GroupMessage> => {
    const { data } = await apiClient.post(`/group-chat/${groupId}/message`, { content });
    return data;
};