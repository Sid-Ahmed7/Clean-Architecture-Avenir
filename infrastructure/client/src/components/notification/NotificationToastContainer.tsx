"use client";

import { useState, useCallback, useRef } from "react";
import { NotificationToast } from "./NotificationToast";
import { NotificationModel } from "@/lib/validation/notification/notificationSchema";
import { useNotificationSSE } from "@/hooks/useNotificationSSE";

export const NotificationToastContainer = () => {
    const [toasts, setToasts] = useState<NotificationModel[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const toastTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    const handleNewNotification = useCallback((updater: (prev: NotificationModel[]) => NotificationModel[]) => {
        setToasts(prev => {
            const newNotifications = updater(prev);
            const latestNotification = newNotifications[0];

            if (latestNotification && !prev.some(t => t.id === latestNotification.id)) {
                const timeout = setTimeout(() => {
                    setToasts(current => current.filter(t => t.id !== latestNotification.id));
                    toastTimeoutsRef.current.delete(latestNotification.id);
                }, 5000);

                toastTimeoutsRef.current.set(latestNotification.id, timeout);
                return newNotifications;
            }

            return prev;
        });
    }, []);

    useNotificationSSE(handleNewNotification, setUnreadCount, setError);

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {toasts.map((notification, index) => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    index={index}
                />
            ))}
        </div>
    );
};
