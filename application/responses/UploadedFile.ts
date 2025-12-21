import { MediaTypeEnum } from "../../domain/enums/MediaTypeEnum";

export interface UploadedFile {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    type: MediaTypeEnum;
}