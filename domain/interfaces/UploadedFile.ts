import { MediaTypeEnum } from "../enums/MediaTypeEnum";

export interface UploadedFile {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    type: MediaTypeEnum;
}