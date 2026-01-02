import { EventBusInterface } from "../../../../application/ports/event/EventBusInterface";
import { pgPool } from '../../config/database/configPostgresSQL';

export class PostgresEventBus implements EventBusInterface {
  private handlers: Map<string, ((event: any) => Promise<void>)[]> = new Map();

  async publish<T extends { eventName: string }>(event: T): Promise<void> {
    const eventName = event.eventName;

    const client = await pgPool.connect();
    try {
      await client.query(
        'INSERT INTO events (event_name, event_data, created_at) VALUES ($1, $2, NOW())',
        [eventName, JSON.stringify(event)]
      );
    } finally {
      client.release();
    }

    const eventHandlers = this.handlers.get(eventName) || [];
    for (const handler of eventHandlers) {
      await handler(event);
    }
  }

  subscribe<T>(eventName: string, handler: (event: T) => Promise<void>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)?.push(handler as (event: any) => Promise<void>);
  }
}
