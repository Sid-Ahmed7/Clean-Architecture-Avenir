"use client";

import { useNotification } from "@/lib/hooks/useNotifications";
import { useNotificationSSE } from "@/lib/hooks/useNotificationSSE";
import { Bell } from "lucide-react";
import { useState } from "react"
import { NotificationList } from "./NotificationList";

export const NotificationMenu = () => {
    const [open, setOpen] = useState(false);
    const {notifications, unreadCount, setNotifications,setUnreadCount, setError, markReadNotification, deleteOneNotification} = useNotification();
    useNotificationSSE(setNotifications, setUnreadCount, setError);

    const toggleMenu = () => {
        setOpen(prev => !prev)
    };

    const handleMarkRead = (notificationId: number) => {
        markReadNotification(notificationId);
    }

    const handleDelete = (notificationId: number) => {
        deleteOneNotification(notificationId);
    }

    return (
        <div className="relative">
            <button
                onClick={toggleMenu}
                className="relative p-2 rounded-full hover:bg-gray-100"
            >
                <Bell className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                    <NotificationList
                        notifications={notifications}
                        onMarkRead={handleMarkRead}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    )
}