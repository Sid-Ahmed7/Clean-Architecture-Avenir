import { UploadedFile } from "./uploadedFile";

export interface MediaFile {
    file: File;
    preview: string;
    uploadedFile?: UploadedFile
}