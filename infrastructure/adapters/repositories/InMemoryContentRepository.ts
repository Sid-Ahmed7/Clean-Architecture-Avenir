import { ContentNotFoundError } from "../../../application/errors/ContentNotFoundError";
import { ContentRepositoryInterface } from "../../../application/ports/repositories/news/ContentRepositoryInterface";
import { ContentEntity } from "../../../domain/entities/ContentEntity";
import { InvalidContentError } from "../../../domain/errors/InvalidContentError";


export class InMemoryContentRepository implements ContentRepositoryInterface {

    
    private contents: Array<ContentEntity>;
    private incrId;

    public constructor() {
        this.contents = [];
        this.incrId = 0;
    }

    public async findById(id: number): Promise<ContentEntity | ContentNotFoundError> {
        const content = this.contents.find((c) => c.id === id);
        if(!content) {
            return new ContentNotFoundError(`Content with ${id} not found`);
        }
        return content;
    }

    public async findByNewsId(newsId: number): Promise<Array<ContentEntity>> {
        return this.contents.filter(c => c.newsId === newsId).sort((a, b) => a.order - b.order);
    }

    public async create(content: ContentEntity): Promise<ContentEntity | InvalidContentError> {
        if(!content) {
            return new InvalidContentError("Error creation content");
        }
        this.incrId++;
        content.id = this.incrId;
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

    public async delete(id: number): Promise<void | ContentNotFoundError> {
        const index = this.contents.findIndex(c => c.id === id);
        if(index === -1) {
            return new ContentNotFoundError(`Content with id ${id} not found`);
        }
        this.contents.splice(index, 1);
    }
       public getNextOrder(newsId: number): number {
        const items = this.contents.filter(c => c.newsId === newsId);
        if(items.length === 0) {
            return 1;
        }
        return Math.max(...items.map(m => m.order)) + 1;

    }

}