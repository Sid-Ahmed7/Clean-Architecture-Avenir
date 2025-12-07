export interface OrderService {
    getNextOrder(newsId: string): Promise<number>;
}
