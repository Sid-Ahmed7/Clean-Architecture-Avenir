import { Notification, NotificationEnum } from "@/types/Notification";
import { apiClient } from "./apiClient";

export const createNotification = async (message: string, type: NotificationEnum): Promise<Notification> => {
    const {data} = await apiClient.post<Notification>("/notification/create", {message, type});
    return data;
}


export const sendNotificationToClient = async (targetUserId: string, message: string, type:NotificationEnum): Promise<Notification> => {
    const {data} = await apiClient.post<Notification>("/notification/send-to-client", {targetUserId, message, type});
    return data;
}

export const getUserNotifications = async(): Promise<Notification[]> => {
    const { data } = await apiClient.get<Notification[]>("/notification");
    return data;
}

export const markNotificationAsRead = async (notificationId: number) => {
    const {data} = await apiClient.put("/notification/read", {notificationId});
    return data
}

export const deleteNotification = async (notificationId: number) => {
await apiClient.delete(`/notification/${notificationId}`);
}




