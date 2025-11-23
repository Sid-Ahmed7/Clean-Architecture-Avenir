import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { InvalidUrlMediaError } from "../../../../domain/errors/InvalidUrlMediaError";
import { MediaNotFoundError } from "../../../errors/MediaNotFoundError";

export interface MediaRepositoryInterface {

    create(media: MediaEntity): Promise<MediaEntity | InvalidUrlMediaError>
    findById(id: number): Promise<MediaEntity | MediaNotFoundError>
    findByNewsId(newsId: number): Promise<Array<MediaEntity>>
    findByIds(ids: number[]): Promise<MediaEntity[] | MediaNotFoundError>;
    delete(id: number): Promise<void | MediaNotFoundError>;
}