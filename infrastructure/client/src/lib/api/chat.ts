import { apiClient } from "./apiClient"

export const createConversation = async () => {
    const {data} = await apiClient.post("/chat/conversation/create");
    return data;
}

export const sendMessage = async ({conversationId, content}: {conversationId: number; content: string;}) => {
  const { data } = await apiClient.post("/chat/send", {conversationId,content});
  return data;
};

export const getConversationMessages = async (id: number) => {
  const { data } = await apiClient.get(`/chat/${id}/messages`);
  return data;
};



export const markMessageAsRead = async (messageId: number) => {
    const {data} = await apiClient.post("/chat/mark-read", {message: messageId});
    return data
}

export const transferConversation = async (conversationId: number, newAdvisorId: string) => {
  const { data } = await apiClient.post("/chat/transfer", { conversationId: conversationId, newAdvisorId });
return data
}

export const getAllPendingConversations = async () => {
  const { data } = await apiClient.get(`/chat/conversations`);
  return Array.isArray(data) ? data : data.conversations ?? [];
};

export const getAdvisorConversation = async () => {
    const {data} = await apiClient.get(`/chat/conversations/assigned`);
      return Array.isArray(data) ? data : data.conversations ?? [];

}

export const getClientConversation = async () => {
    const {data} = await apiClient.get(`/chat/conversations/client`);
    return Array.isArray(data) ? data : [];

    
  }




