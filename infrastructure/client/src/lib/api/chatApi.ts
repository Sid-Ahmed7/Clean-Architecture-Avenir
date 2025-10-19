import { apiClient } from "./apiClient"




export const createConversation = async () => {
    const {data} = await apiClient.post("/chat/conversation/create");
    return data;
}

export const getConversationMessages = async (conversationId: number) => {
    const {data} = await apiClient.get(`/chat/${conversationId}/messages`);
    return data
}


