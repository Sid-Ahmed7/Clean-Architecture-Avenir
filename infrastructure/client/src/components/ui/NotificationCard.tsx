"use client";

import { NotificationModel } from "@/lib/validation/notification/notificationSchema";
import { notificationStyles } from "../notification/notificationsStyles";
import Button from "./Button";
import { X } from "lucide-react";

interface NotificationCardProps  {
    notification: NotificationModel;
    onMarkRead?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export const NotificationCard =({notification, onMarkRead, onDelete} : NotificationCardProps) => {
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
                <p className={`text-sm ${notification.readStatus === "UNREAD" ? "font-semibold" : "font-normal"} text-gray-700`}>{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.createdAt}</p>
            </div>
            <Button variant="danger" onClick={handleDelete}>
                <X className="w-4 h-4"></X>
            </Button>
        </div>
    )





}