import axios from "axios";
import { refreshToken } from "./auth";
import { Router } from "next/router";


export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
})

apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest =  error.config;

        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshToken();
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            } 
        }

        return Promise.reject(error);
    }
)