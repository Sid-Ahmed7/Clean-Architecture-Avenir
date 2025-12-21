"use client";

import { NotificationModel } from "@/lib/validation/notification/notificationSchema";
import { NotificationCard } from "./NotificationCard";


interface NotificationListProps  {
    notifications: NotificationModel[];
    onMarkRead?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const NotificationList = ({notifications, onMarkRead, onDelete} :  NotificationListProps) => {

    const hasNoNotifications = notifications.length === 0;

    return (
        <div className="max-h-96 overflow-y-auto">
            {hasNoNotifications ? (
                <div className="p-4 text-center text-gray-500">
                    Aucune Notification
                </div>
            ): (
                notifications.map((notification) => (
                    <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkRead={onMarkRead}
                        onDelete={onDelete}
                    />
                ))
            )}
        </div>
    )

}