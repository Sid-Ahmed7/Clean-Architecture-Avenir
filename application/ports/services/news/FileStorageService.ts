import { FileDeleteError } from "../../../../domain/errors/upload/FileDeleteError";
import { FileUploadError } from "../../../../domain/errors/upload/FileUploadError";
import { UploadedFile } from "../../../responses/UploadedFile";
import { UploadOptions } from "../../../requests/UploadOptions";

export interface FileStorageService {
    upload(file: File | Buffer, originalName?: string, options?: UploadOptions): Promise<UploadedFile | FileUploadError>;
    delete(url: string): Promise<boolean | FileDeleteError>;
    exists(url: string): Promise<boolean>;
}