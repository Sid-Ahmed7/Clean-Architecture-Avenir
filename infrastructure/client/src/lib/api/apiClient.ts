import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { CookieValueTypes, getCookie, setCookie } from "cookies-next";
import { refreshToken } from "./auth";

let refreshPromise: Promise<{ success: boolean; error?: string }> | null = null;

export const createApiClient = (cookies?: Record<string, CookieValueTypes>): AxiosInstance => {
  const isServer = typeof window === "undefined";
  const baseURL = isServer ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL;

  const client = axios.create({
    baseURL,
    withCredentials: true, 
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!refreshPromise) {
          refreshPromise = refreshTokenRequest()
            .then((result) => {
              refreshPromise = null;
              return result;
            })
            .catch((err: Error) => {
              refreshPromise = null;
              return { success: false, error: err.message };
            });
        }

        const refreshResult = await refreshPromise;
        if (refreshResult.success) {
          return client(originalRequest);
        }

        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

const refreshTokenRequest = async () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return { success: false, error: "Refresh not available on server" };
  }

  try {
    const response = await refreshToken();
    
    if (!response.success) {
      return { success: false, error: response.error };
    }

    const accessToken = response.data?.accessToken;
    
    if (accessToken) {
      setCookie("accessToken", accessToken);
      return { success: true };
    }

    return { success: false, error: "No access token returned" };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return { success: false, error: "Token refresh failed" };
  }
};
