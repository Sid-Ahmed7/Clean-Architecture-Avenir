import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { InvalidUrlMediaError } from "../../../../domain/errors/InvalidUrlMediaError";
import { MediaNotFoundError } from "../../../errors/MediaNotFoundError";

export interface MediaRepositoryInterface {

    create(media: MediaEntity): Promise<MediaEntity | InvalidUrlMediaError>
    findById(mediaId: string): Promise<MediaEntity | MediaNotFoundError>
    findByNewsId(newsId: string): Promise<Array<MediaEntity>>
    findByIds(mediaIds: string[]): Promise<MediaEntity[] | MediaNotFoundError>;
    update(media: MediaEntity) :Promise<MediaEntity | MediaNotFoundError>;
    delete(mediaId: string): Promise<void | MediaNotFoundError>;
}