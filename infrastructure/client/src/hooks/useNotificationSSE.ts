import { useEffect } from "react";
import { NotificationModel, notificationSchema } from "../validation/notification/notificationSchema";
import { useTranslations } from "next-intl";

export function useNotificationSSE(
    setNotifications: (updater:(prev:NotificationModel[]) => NotificationModel[]) => void,
    setUnreadCount: (updater: (prev: number) => number) => void,
    setError: (error: string) => void
    )
    {

    const t = useTranslations();
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    const handleNewNotification =(e: MessageEvent) => {

        try {
             const newNotification =  notificationSchema(t).parse(JSON.parse(e.data));
             setNotifications(prev => [newNotification, ...prev]);
             if(newNotification.readStatus === "UNREAD") {
                setUnreadCount(prev => prev + 1);
             }
        } catch(err) {
            setError("Erreur lors de la réception d'une notification");
        }
    };
    
    useEffect(() => {
        const eventSource = new EventSource(`${baseURL}/notification/subscribe`, { withCredentials: true });
        eventSource.addEventListener("new_notification", handleNewNotification);

        eventSource.onerror = (err) => {
            setError("Erreur de connexion SSE");
        };
        
        return () => eventSource.close();
    }, [baseURL])
}