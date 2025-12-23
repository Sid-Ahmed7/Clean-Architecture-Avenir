import { NotificationEnum } from "@/types/Notification";
import { sendNotificationToClient } from "../api/notification";

export const notifyClientAssigned = async (clientId: string, advisorName?: string, senderId?: string) => {
    
    try {
        await sendNotificationToClient(
            clientId, 
            `Votre conversation a été prise en charge par le conseiller ${advisorName}.`,
            NotificationEnum.ACTION, 
            senderId
        );
    } catch (err) {
        console.error("Erreur lors de l'envoi de la notification au client :", err);
    }
}