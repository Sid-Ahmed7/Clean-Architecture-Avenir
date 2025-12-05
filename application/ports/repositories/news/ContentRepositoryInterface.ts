import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { InvalidContentError } from "../../../../domain/errors/InvalidContentError";
import { InvalidUrlMediaError } from "../../../../domain/errors/InvalidUrlMediaError";
import { ContentNotFoundError } from "../../../errors/ContentNotFoundError";
import { MediaNotFoundError } from "../../../errors/MediaNotFoundError";

export interface ContentRepositoryInterface {

    create(content: ContentEntity): Promise<ContentEntity | InvalidContentError>
    findById(contentId: string): Promise<ContentEntity | ContentNotFoundError>
    findByNewsId(newsId: string): Promise<Array<ContentEntity>>
    update(content: ContentEntity): Promise<ContentEntity | ContentNotFoundError>;
    delete(contentId: string): Promise<void | ContentNotFoundError>;
}