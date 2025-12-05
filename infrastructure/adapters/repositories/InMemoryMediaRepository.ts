import { MediaNotFoundError } from "../../../application/errors/MediaNotFoundError";
import { MediaRepositoryInterface } from "../../../application/ports/repositories/news/MediaRepositoryInterface";
import { MediaEntity } from "../../../domain/entities/MediaEntity";
import { InvalidUrlMediaError } from "../../../domain/errors/InvalidUrlMediaError";

export class InMemoryMediaRepository implements MediaRepositoryInterface {

    private mediaList: Array<MediaEntity>;

    public constructor() {
        this.mediaList = [];
    }

    public async findById(mediaId: string): Promise<MediaEntity | MediaNotFoundError> {
        const media = this.mediaList.find((m) => m.id === mediaId);
        if(!media) {
            return new MediaNotFoundError(`Media with id ${mediaId} not found`);
        }
        return media;
    }

    public async findByNewsId(newsId: string): Promise<Array<MediaEntity>> {
        return this.mediaList.filter((m) => m.newsId === newsId); 
    }

    public async findByIds(mediaIds: string[]): Promise<MediaEntity[] | MediaNotFoundError> {
        const found = this.mediaList.filter(m => mediaIds.includes(m.id));
        if (found.length === 0) {
            return new MediaNotFoundError(`No media found for given IDs`);
        }
        return found;
    }

    public async create(media: MediaEntity): Promise<MediaEntity | InvalidUrlMediaError> {
        
        if(!media) {
            return new InvalidUrlMediaError("Error creation media")
        }

        this.mediaList.push(media);

        return media;
    }
    public async update(media: MediaEntity): Promise<MediaEntity | MediaNotFoundError> {
        const index = this.mediaList.findIndex((m) => m.id === media.id);
        if (index === -1) {
            return new MediaNotFoundError(`Media with id ${media.id} not found`);
        }
        this.mediaList[index] = media;
        return media;
    }

    public async delete(mediaId: string): Promise<void | MediaNotFoundError> {
        const index = this.mediaList.findIndex((m) => m.id === mediaId);
        if (index === -1) {
            return new MediaNotFoundError(`Media with id ${mediaId} not found`);
        }
        
        this.mediaList.splice(index, 1);
    }
}