import { apiClient } from "./apiClient";

export const getAllAdvisors = async () => {
    const {data} = await apiClient.get(`/auth/getAdvisors`);
      return Array.isArray(data) ? data : data ?? [];
}

export const refreshToken = async () => {
  try {
    const { data } = await apiClient.post('/auth/refresh-token');
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Refresh failed' 
    };
  }
};


