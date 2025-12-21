import { NewsEntity } from "../../../../domain/entities/NewsEntity";

export interface SseClient {
    write(data: string): void;
    close(): void;
}

export interface NewsPublisher {
    publish(news: NewsEntity): void;
    publishUpdate(news: NewsEntity): void;
    publishDelete(newsId: string): void;
    subscribe(client: SseClient): void;
    unsubscribe(client: SseClient): void;
}