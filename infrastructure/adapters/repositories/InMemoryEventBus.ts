import { EventBusInterface } from "../../../application/ports/event/EventBusInterface";

export class InMemoryEventBus implements EventBusInterface {
  private handlers: Map<string, ((event: any) => Promise<void>)[]> = new Map();

  async publish<T extends { eventName: string }>(event: T): Promise<void> {
    const eventName = event.eventName;
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
