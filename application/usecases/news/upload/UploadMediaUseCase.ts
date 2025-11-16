import { EmptyFileError } from "../../../../domain/errors/upload/EmptyFileError";
import { UnsupportedMediaTypeError } from "../../../../domain/errors/upload/UnsupportedMediaTypeError";
import { UploadedFile } from "../../../../domain/interfaces/UploadedFile";
import { MediaValidation } from "../../../../domain/services/MediaValidation";
import { FileStorageService } from "../../../ports/services/news/FileStorageService";

export class UploadMediaUseCase {
   
    constructor(private fileStorageService: FileStorageService) {}

    async execute(file: Buffer, fileName: string, mimeType: string): Promise<UploadedFile | Error> {

        if (!file || file.length === 0) {
            return new EmptyFileError("No file provided or file is empty");
        }

        const isImage = mimeType.startsWith('image/');
        const isVideo = mimeType.startsWith('video/');

        if (!isImage && !isVideo) {
            return new UnsupportedMediaTypeError("Unsupported file type");
        }

        const options = {
            folder: isImage ? 'images' : 'videos',
            maxSize: isImage ? MediaValidation.IMAGE_MAX_SIZE : MediaValidation.VIDEO_MAX_SIZE,
            allowedTypes: isImage ? MediaValidation.ALLOWED_IMAGE_TYPES : MediaValidation.ALLOWED_VIDEO_TYPES
        };

        return await this.fileStorageService.upload(file, fileName, options);
    }

}