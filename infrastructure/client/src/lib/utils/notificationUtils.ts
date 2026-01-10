
import { NotificationEnum } from "@/types/Notification";
import { sendNotificationToClient } from "../api/notification";
import { getTranslations } from 'next-intl/server';


export const notifyClientAssigned = async (clientId: string, advisorName?: string, senderId?: string, locale: string = 'fr') => {
    const t = await getTranslations({ locale });
    try {
        await sendNotificationToClient(
            clientId,
            t('notifications.clientAssigned', { advisorName }),
            NotificationEnum.ACTION,
            senderId
        );
    } catch (err) {
        console.error(t('generalErrors.notificationService.send'), err);
    }
}