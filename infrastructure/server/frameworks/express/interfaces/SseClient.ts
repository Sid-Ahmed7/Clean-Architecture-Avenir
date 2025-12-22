export interface SseClient {
    write(data: string): void;
    close(): void;
}