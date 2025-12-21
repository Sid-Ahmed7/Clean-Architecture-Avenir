
import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { MediaRepositoryInterface } from "../../../ports/repositories/news/MediaRepositoryInterface";
export class UpdateMediaUseCase {
    
    constructor(private readonly mediaRepository: MediaRepositoryInterface) {}

    async execute(media:MediaEntity): Promise<MediaEntity | Error> {
        
        const existingMedia  = await this.mediaRepository.findById(media.id);
        if (existingMedia  instanceof Error) {
            return existingMedia;
        }

        const updatedMedia = await this.mediaRepository.update(media);
       
        if (updatedMedia instanceof Error) {
            return updatedMedia;
        }

        return updatedMedia;
    }
}