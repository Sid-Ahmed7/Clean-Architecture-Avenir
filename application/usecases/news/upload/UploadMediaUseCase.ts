import { EmptyFileError } from "../../../../domain/errors/upload/EmptyFileError";
import { InvalidMediaTypeError } from "../../../../domain/errors/InvalidMediaTypeError";
import { UploadedFile } from "../../../responses/UploadedFile";
import { MediaTypeValue } from "../../../../domain/values/MediaTypeValue";
import { FileStorageService } from "../../../ports/services/news/FileStorageService";

export class UploadMediaUseCase {
   
    constructor(private readonly fileStorageService: FileStorageService) {}

    async execute(file: Buffer, fileName: string, mimeType: string): Promise<UploadedFile | Error> {

        if (!file || file.length === 0) {
            return new EmptyFileError("No file provided or file is empty");
        }

        const fileSize = file.length;
        const mediaType = MediaTypeValue.from(mimeType, fileSize);

        if (mediaType instanceof InvalidMediaTypeError) {
            return mediaType;
        }

        const isImage = mediaType.isImage();
        const options = {
            folder: isImage ? 'images' : 'videos',
            maxSize: isImage ? MediaTypeValue.IMAGE_MAX_SIZE : MediaTypeValue.VIDEO_MAX_SIZE,
            allowedTypes: isImage ? MediaTypeValue.ALLOWED_IMAGE_TYPES : MediaTypeValue.ALLOWED_VIDEO_TYPES
        };

        return await this.fileStorageService.upload(file, fileName, options);
    }

}