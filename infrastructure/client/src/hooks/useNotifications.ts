"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { NotificationEnum } from "@/types/Notification";
import { NotificationModel, notificationSchema } from "@/lib/validation/notification/notificationSchema";
import { createNotification, deleteNotification, getUserNotifications, markNotificationAsRead, sendNotificationToClient } from "@/lib/api/notification";

export function useNotification() {
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const t = useTranslations();
    const [error, setError] = useState<string>("");

    const fetchNotifications = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError("");

        try {
            const data = await getUserNotifications();
            const parsed =  notificationSchema(t).array().safeParse(data);
            if(!parsed.success) {
                setError(t('generalErrors.notifications.validation'));
                return;
            }
            setNotifications(parsed.data)
            setUnreadCount(parsed.data.filter((notification) => notification.readStatus === "UNREAD").length);
        } catch (err: any) {
            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('generalErrors.notifications.unknown'));
            }
        } finally {
            setLoading(false)
        }
    }, []);

        const addNotification = async (type: NotificationEnum, message: string) => {
            try {
                const data = await createNotification(message, type);
                const parsed =  notificationSchema(t).safeParse(data);
                if(!parsed.success) {
                    setError(t('generalErrors.notifications.validation'));
                    return;
                }    
                setNotifications(prev => [parsed.data, ...prev]);
                setUnreadCount(prev => prev + 1);
            }catch (err: any) {
                setError(err?.message || "Impossible de créer la notification");
            }
        }


    const sendNotificationToClientToAdvisor = async (targetUserId: string, message: string, type:NotificationEnum) => {
        try {
            
            const data = await sendNotificationToClient(targetUserId, message,type);
               const parsed =  notificationSchema(t).safeParse(data);
            if(!parsed.success) {
                setError(t('generalErrors.notifications.validation'));
                return;
            }    
            setNotifications(prev => [parsed.data, ...prev])
        } catch (err: any) {
            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('generalErrors.notifications.unknown'));
            }
        }
    
    }

    const markReadNotification = async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);
            const updatedStatus: NotificationModel[] = notifications.map((notification) => notification.id === notificationId ? {...notification, readStatus: "READ"} : notification);
            setNotifications(updatedStatus)
            setUnreadCount(prev => Math.max(prev -1, 0));
        } catch (err: any) {
            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('generalErrors.notifications.unknown'));
            }
        }
    };

    const deleteOneNotification = async (notificationId: string) => {
        try {
            await deleteNotification(notificationId);
            setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
            setUnreadCount(prev => Math.max(prev -1, 0));
        }  catch (err: any) { 
        
        if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('generalErrors.notifications.unknown'));
            }
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications])

    return {notifications,unreadCount, loading, error, fetchNotifications, addNotification, markReadNotification, deleteOneNotification,sendNotificationToClientToAdvisor, setNotifications, setUnreadCount, setError};

}