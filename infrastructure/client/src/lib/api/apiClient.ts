import axios, { AxiosInstance } from "axios";
import { CookieValueTypes,  setCookie } from "cookies-next";
import { refreshToken } from "./auth";

let refreshPromise: Promise<{ success: boolean; error?: string }> | null = null;
let tokenRefreshTimer: NodeJS.Timeout | null = null;

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
      scheduleTokenRefresh(); 
      return { success: true };
    }

    return { success: false, error: "No access token returned" };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return { success: false, error: "Token refresh failed" };
  }
};

const scheduleTokenRefresh = () => {
  const isServer = typeof window === "undefined";
  if (isServer) return;

  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
  }

  const refreshBeforeExpiry = 30 * 1000;
  const tokenDuration = 1000 * 60 * 60 * 24 * 7;
  const refreshTime = tokenDuration - refreshBeforeExpiry;

  tokenRefreshTimer = setTimeout(async () => {
    await refreshTokenRequest();
  }, refreshTime);
};

export const startTokenRefresh = () => {
  scheduleTokenRefresh();
};

export const stopTokenRefresh = () => {
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
    tokenRefreshTimer = null;
  }
};
