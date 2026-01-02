import { OrderService } from "../../../../application/ports/services/news/OrderService";
import { ContentRepositoryInterface } from "../../../../application/ports/repositories/news/ContentRepositoryInterface";
import { MediaRepositoryInterface } from "../../../../application/ports/repositories/news/MediaRepositoryInterface";
export class ManageOrderService implements OrderService {

    constructor(private readonly contentRepository: ContentRepositoryInterface, private mediaRepository: MediaRepositoryInterface) {}

async getNextOrder(newsId: string): Promise<number> {
    const contents = await this.contentRepository.findByNewsId(newsId);
    const medias = await this.mediaRepository.findByNewsId(newsId)

    const allOrders = [...contents.map(c => c.order), ...medias.map(m => m.order)];
    return allOrders.length === 0 ? 0 : Math.max(...allOrders) + 1;
}

}