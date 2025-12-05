import { NewsPublisher, SseClient } from "../../../../application/ports/services/news/NewsPublisher";
import { NewsEntity } from "../../../../domain/entities/NewsEntity";

export class NewsService implements NewsPublisher {
    private clients: Array<SseClient> = [];

    public publishForAction(event: string, news: NewsEntity): void {
        const payload = JSON.stringify(news);

        for(const client of this.clients) {
            client.write(`event: ${event}\ndata: ${payload}\n\n`);
        }
    }

    public publish(news: NewsEntity): void {
        this.publishForAction('new_feed', news);
    }

    public publishUpdate(news: NewsEntity): void {
        this.publishForAction('update_feed', news);
    }

    public publishDelete(newsId: string): void {
        const payload = JSON.stringify({id: newsId});

        for(const client of this.clients) {
            client.write(`event: delete_feed\ndata: ${payload}\n\n`);
        }
    }

    public subscribe(client: SseClient): void {
        this.clients.push(client);
    }

    public unsubscribe(client: SseClient): void {
        this.clients = this.clients.filter((c) => c !== client);
    }
}