import { MediaNotFoundError } from "../../../application/errors/MediaNotFoundError";
import { MediaRepositoryInterface } from "../../../application/ports/repositories/news/MediaRepositoryInterface";
import { MediaEntity } from "../../../domain/entities/MediaEntity";
import { InvalidUrlMediaError } from "../../../domain/errors/InvalidUrlMediaError";

export class InMemoryMediaRepository implements MediaRepositoryInterface {

    private mediaList: Array<MediaEntity>;
    private incrId: number;


    public constructor() {
        this.mediaList = [];
        this.incrId = 0;
    }

    public async findById(id: number): Promise<MediaEntity | MediaNotFoundError> {
        const media = this.mediaList.find((m) => m.id === id);
        if(!media) {
            return new MediaNotFoundError(`Media with id ${id} not found`);
        }
        return media;
    }

    public async findByNewsId(newsId: number): Promise<Array<MediaEntity>> {
        return this.mediaList.filter((m) => m.newsId === newsId); 
    }

    public async findByIds(ids: number[]): Promise<MediaEntity[] | MediaNotFoundError> {
        const found = this.mediaList.filter(m => ids.includes(m.id));
        if (found.length === 0) {
            return new MediaNotFoundError(`No media found for given IDs`);
        }
        return found;
    }

    public async create(media: MediaEntity): Promise<MediaEntity | InvalidUrlMediaError> {
        
        if(!media) {
            return new InvalidUrlMediaError("Erro creation media")
        }

        this.incrId++;
        media.id = this.incrId;
        this.mediaList.push(media);

        return media;
    }

    public async delete(id: number): Promise<void | MediaNotFoundError> {
        const index = this.mediaList.findIndex((m) => m.id === id);
        if (index === -1) {
            return new MediaNotFoundError(`Media with id ${id} not found`);
        }
        
        this.mediaList.splice(index, 1);
    }

    public getNextOrder(newsId: number): number {
        const items = this.mediaList.filter(m => m.newsId === newsId);
        if(items.length === 0) {
            return 1;
        }
        return Math.max(...items.map(m => m.order)) + 1;

    }

}