import { ContentNotFoundError } from "../../../application/errors/ContentNotFoundError";
import { ContentRepositoryInterface } from "../../../application/ports/repositories/news/ContentRepositoryInterface";
import { ContentEntity } from "../../../domain/entities/ContentEntity";
import { InvalidContentError } from "../../../domain/errors/InvalidContentError";


export class InMemoryContentRepository implements ContentRepositoryInterface {

    
    private contents: Array<ContentEntity>;

    public constructor() {
        this.contents = [];
    }

    public async findById(contentId: string): Promise<ContentEntity | ContentNotFoundError> {
        const content = this.contents.find((c) => c.id === contentId);
        if(!content) {
            return new ContentNotFoundError(`Content with ${contentId} not found`);
        }
        return content;
    }

    public async findByNewsId(newsId: string): Promise<Array<ContentEntity>> {
        return this.contents.filter(c => c.newsId === newsId).sort((a, b) => a.order - b.order);
    }

    public async create(content: ContentEntity): Promise<ContentEntity | InvalidContentError> {
        if(!content) {
            return new InvalidContentError("Error creation content");
        }
        this.contents.push(content);
        return content;
    }

    public async update(content: ContentEntity): Promise<ContentEntity | ContentNotFoundError> {
        const index = this.contents.findIndex(c => c.id === content.id);
        if(index === -1) {
            return new ContentNotFoundError(`Content with id ${content.id} not found`);
        }
        this.contents[index] = content;
        return content;
    }

    public async delete(contentId: string): Promise<void | ContentNotFoundError> {
        const index = this.contents.findIndex(c => c.id === contentId);
        if(index === -1) {
            return new ContentNotFoundError(`Content with id ${contentId} not found`);
        }
        this.contents.splice(index, 1);
    }
}