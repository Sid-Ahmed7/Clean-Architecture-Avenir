"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserNotifications, markNotificationAsRead, deleteNotification, createNotification } from "../api/notification";
import { NotificationModel, notificationSchema } from "../validation/notification/notificationSchema";
import { useTranslations } from "next-intl";
import { NotificationEnum } from "@/types/Notification";

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
                setError("Erreur de validation des données reçus");
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
                setError("Une erreur inconnue est survenue");
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
                    setError("Erreur de validation des données reçus");
                    return;
                }    
                setNotifications(prev => [parsed.data, ...prev]);
                setUnreadCount(prev => prev + 1);
            }catch (err: any) {
                setError(err?.message || "Impossible de créer la notification");
            }
        }


    const sendNotificationToClientFromAdvisor = async (targetUserId: string, message: string, type:NotificationEnum) => {
        try {
            
            const data = await sendNotificationToClientFromAdvisor(targetUserId, message,type);
               const parsed =  notificationSchema(t).safeParse(data);
            if(!parsed.success) {
                setError("Erreur de validation des données reçus");
                return;
            }    
            setNotifications(prev => [parsed.data, ...prev])
        } catch (err: any) {
            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Une erreur inconnue est survenue");
            }
        }
    
    }

    const markReadNotification = async (notificationId: number) => {
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
                setError("Une erreur inconnue est survenue");
            }
        }
    };

    const deleteOneNotification = async (notificationId: number) => {
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
                setError("Une erreur inconnue est survenue");
            }
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications])

    return {notifications,unreadCount, loading, error, fetchNotifications, addNotification, markReadNotification, deleteOneNotification,sendNotificationToClientFromAdvisor, setNotifications, setUnreadCount, setError};

}