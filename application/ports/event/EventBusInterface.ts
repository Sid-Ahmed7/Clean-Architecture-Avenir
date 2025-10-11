export interface EventBusInterface {
  publish<T extends { eventName: string }>(event: T): Promise<void>;
  subscribe<T extends object>(eventName: string, handler: (event: T) => Promise<void>): void;
}
