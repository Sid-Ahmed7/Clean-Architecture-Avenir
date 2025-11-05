import { NotificationPublisher, SseClient } from "../../../../application/ports/services/notification/NotificationPublisher";
import { NotificationEntity } from "../../../../domain/entities/NotificationEntity";

export class NotificationService implements NotificationPublisher {

    private clients: Map<string, SseClient[]> = new Map();

    public sendNotification(userId: string, notification: NotificationEntity): void {
        const userClients = this.clients.get(userId);
        if(!userClients) {
            return;
        }
        const payload = JSON.stringify(notification);
        for(const client of userClients)  {
            client.write(`event: new_notification\ndata: ${payload}\n\n`);
        }
    }

    public subscribe(userId: string, client: SseClient): void {
        const userClients = this.clients.get(userId) ?? [];
        userClients.push(client);
        this.clients.set(userId, userClients);
    }

    public unsubscribe(userId: string): void {
        this.clients.delete(userId);
    }
}