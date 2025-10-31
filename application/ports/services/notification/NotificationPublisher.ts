import { NotificationEntity } from "../../../../domain/entities/NotificationEntity";

export interface SseClient {
    write(data: string): void;
    close(): void;
}

export interface NotificationPublisher {
    sendNotification(userId: string, notification: NotificationEntity): void;
    subscribe(userId: string, client: SseClient): void;
    unsubscribe(userId: string): void;
}