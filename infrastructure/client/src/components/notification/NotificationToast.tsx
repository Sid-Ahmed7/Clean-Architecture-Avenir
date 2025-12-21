"use client";

import { NotificationModel } from "@/lib/validation/notification/notificationSchema";
import { notificationStyles } from "./notificationsStyles";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/formatDate";

interface NotificationToastProps {
    notification: NotificationModel;
    index: number;
}
export const NotificationToast = ({notification, index} : NotificationToastProps) => {
     
    const [isVisible, setIsVisible] = useState(false);

    const timeToShowToast = () => {
        const timeDiplay = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timeDiplay);
    }

    useEffect(() => {
        return timeToShowToast();
    }, [])

     const style = notificationStyles[notification.type];
       if(!style) {
        return;
    }
    const Icon = style.icon ?? null;


    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg shadow-lg ${style.color} border transition-all duration-500 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`} style={{transitionDelay: `${index * 100}ms`}}>
            <Icon className={`w-5 h-5 mt-0.5 transition-transform duration-500 flex-shrink-0 ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"}`} />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
            </div>
        </div>
    )


}