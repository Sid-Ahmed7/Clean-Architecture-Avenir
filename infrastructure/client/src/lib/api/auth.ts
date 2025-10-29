import { apiClient } from "./apiClient";

export const getAllAdvisors = async () => {
    const {data} = await apiClient.get(`/auth/getAdvisors`);
      return Array.isArray(data) ? data : data ?? [];
}

export const refreshToken = async () => {
  const {data} = await apiClient.post('/auth/refresh-token');
  return data;
}


