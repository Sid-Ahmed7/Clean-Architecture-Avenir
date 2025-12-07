import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { InvalidContentError } from "../../../../domain/errors/InvalidContentError";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";

export class ReorderContentsUseCase {
    public constructor(private readonly contentRepository: ContentRepositoryInterface) {}

    public async execute(newsId: string, newOrder: string[]): Promise<ContentEntity[] | Error> {
        const contents = await this.contentRepository.findByNewsId(newsId);

        if (contents.length !== newOrder.length) {
            return new InvalidContentError("Order array length mismatch");
        }

        const contentMap = new Map(contents.map(c => [c.id, c]));
        const reordered: ContentEntity[] = [];

        let position = 1;

        for (const contentId of newOrder) {
            const content = contentMap.get(contentId);
            if (!content) {
                return new InvalidContentError(`Content ID ${contentId} not found`);
            }

            content.setOrder(position++);

            const updated = await this.contentRepository.update(content);
            if (updated instanceof Error){
                return updated;
            }

            reordered.push(updated);
        }

        return reordered;
    }
}
