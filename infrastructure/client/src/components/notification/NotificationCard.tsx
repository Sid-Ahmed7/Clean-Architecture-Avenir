"use client";

import { NotificationModel } from "@/lib/validation/notification/notificationSchema";
import { notificationStyles } from "./notificationsStyles";
import { formatDate } from "@/lib/utils/formatDate";
import Button from "../ui/Button";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface NotificationCardProps  {
    notification: NotificationModel;
    onMarkRead?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const NotificationCard =({notification, onMarkRead, onDelete} : NotificationCardProps) => {
    const t = useTranslations("components.notification");
    const style = notificationStyles[notification.type];
    const Icon = style.icon;

    const handleMarkRead = () => {
        if(onMarkRead) {
            onMarkRead(notification.id)
        }
    };
    
    const handleDelete = () => {
        if(onDelete) {
            onDelete(notification.id)
        }
    }


    return (
        <div className={`flex items-start gap-3 p-3 border-b ${style.color}`}>
            <Icon className="w-5 h-5 mt-1" />
            <div className="flex-1 cursor-pointer" onClick={handleMarkRead}>
                {notification.senderName && (
                    <p className="text-xs font-medium text-gray-600 mb-1">{t("from")}: {notification.senderName}</p>
                )}
                <p className={`text-sm ${notification.readStatus === "UNREAD" ? "font-semibold" : "font-normal"} text-gray-700`}>{notification.message}</p>
                <p className="text-sm text-gray-500">{formatDate(notification.createdAt)}</p>
            </div>
            <Button variant="danger" onClick={handleDelete}>
                <X className="w-4 h-4"></X>
            </Button>
        </div>
    )





}