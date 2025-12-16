import { apiClient } from "./apiClient";
import { LoginInput } from "../validation/auth/loginSchema";

export const login = async (data: LoginInput) => {
  return await apiClient.post("/auth/login", data);
};

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
