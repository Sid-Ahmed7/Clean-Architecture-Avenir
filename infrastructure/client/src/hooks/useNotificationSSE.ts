import { useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { NotificationModel, notificationSchema } from "@/lib/validation/notification/notificationSchema";

export function useNotificationSSE(
    setNotifications: (updater:(prev:NotificationModel[]) => NotificationModel[]) => void,
    setUnreadCount: (updater: (prev: number) => number) => void,
    setError: (error: string) => void
    )
    {

    const t = useTranslations();
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    const handleNewNotification = useCallback((e: MessageEvent) => {
        console.log("SSE Message received:", e.data);
        try {
             const newNotification =  notificationSchema(t).parse(JSON.parse(e.data));
             console.log("Parsed notification:", newNotification);
             setNotifications(prev => [newNotification, ...prev]);
             if(newNotification.readStatus === "UNREAD") {
                setUnreadCount(prev => prev + 1);
             }
        } catch(err) {
            console.error("Error parsing notification:", err);
            setError("Erreur lors de la réception d'une notification");
        }
    }, [t, setNotifications, setUnreadCount, setError]);
    
    useEffect(() => {
        const eventSource = new EventSource(`${baseURL}/notification/subscribe`, { withCredentials: true });
        eventSource.addEventListener("new_notification", handleNewNotification);

        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            setError("Erreur de connexion SSE");
        };

        return () => {
            console.log("Closing SSE connection");
            eventSource.close();
        };
    }, [baseURL, handleNewNotification, setError])
}