export interface OrderService {
    getNextOrder(newsId: number): Promise<number>;
}
