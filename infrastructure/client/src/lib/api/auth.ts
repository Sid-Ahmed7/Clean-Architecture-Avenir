import { apiClient } from "./apiClient";
import { LoginInput } from "../validation/auth/loginSchema";
import { CreateAdminInput } from "../validation/auth/createAdminSchema";

export const login = async (data: LoginInput) => {
  return await apiClient.post("/auth/login", data);
};

export const createAdmin = async (data: CreateAdminInput) => {
  return await apiClient.post("/auth/admin/create", data);
};

export const getAllAdvisors = async () => {
    const {data} = await apiClient.get(`/auth/getAdvisors`);
      return Array.isArray(data) ? data : data ?? [];
}

export const refreshToken = async () => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseURL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Refresh token failed');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Refresh failed'
    };
  }
};
