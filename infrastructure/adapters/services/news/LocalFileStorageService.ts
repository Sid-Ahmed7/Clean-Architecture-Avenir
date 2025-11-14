import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { FileStorageService } from "../../../../application/ports/services/news/FileStorageService";
import { UploadOptions } from "../../../../domain/interfaces/UploadOptions";
import { UploadedFile } from "../../../../domain/interfaces/UploadedFile";
import { EmptyFileError } from "../../../../domain/errors/upload/EmptyFileError";
import { InvalidFileTypeError } from "../../../../domain/errors/upload/InvalidFileTypeError";
import { FileSizeExceededError } from "../../../../domain/errors/upload/FileSizeExceededError";
import { FileUploadError } from "../../../../domain/errors/upload/FileUploadError";
import { MediaTypeEnum } from "../../../../domain/enums/MediaTypeEnum";


export class LocalFileStorageService implements FileStorageService {
    private uploadDir: string;

    constructor(uploadDir: string = "public/uploads") {
        this.uploadDir = uploadDir;
    }

    async upload(file: File | Buffer, originalName?: string, options?: UploadOptions): Promise<UploadedFile | Error> {
        const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

        const size = file instanceof File ? file.size : file.length;
        const mimeType = file instanceof File ? file.type : (options?.allowedTypes?.[0] || 'application/octet-stream');
        const fileName = file instanceof File ? file.name : (originalName || 'file');

        if (size === 0) {
            return new EmptyFileError("File cannot empty");
        }

        if (options?.allowedTypes && !options.allowedTypes.includes(mimeType)) {
            return new InvalidFileTypeError("Invalid File Type");
        }

        if (options?.maxSize && size > options.maxSize) {
            return new FileSizeExceededError("File size exceeded");
        }

        const type = mimeType.startsWith('image/') ? MediaTypeEnum.IMAGE : MediaTypeEnum.VIDEO;

        const folder = options?.folder || type + 's';
        const folderPath = path.join(process.cwd(), this.uploadDir, folder);

        if (!existsSync(folderPath)) {
            const mkdirResult = await mkdir(folderPath, { recursive: true })
                .then(() => true)
                .catch(() => new FileUploadError(`Impossible de créer le dossier: ${folderPath}`));
            
            if (mkdirResult instanceof Error){
                return mkdirResult;
            }
        }

        const ext = this.getExtension(fileName);
        const uniqueName = options?.filename || `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filepath = path.join(folderPath, uniqueName);

        const writeResult = await writeFile(filepath, buffer)
            .then(() => true)
            .catch(() => new FileUploadError(`Impossible d'écrire le fichier: ${uniqueName}`));

        if (writeResult instanceof Error) return writeResult;

        const publicUrl = `/${this.uploadDir}/${folder}/${uniqueName}`;

        return {
            url: publicUrl,
            filename: fileName,
            size,
            mimeType,
            type
        };
    }

    async delete(url: string): Promise<boolean | Error> {
        const filepath = path.join(process.cwd(), url);

        if (!existsSync(filepath)) {
            return false;
        }

        return await unlink(filepath)
            .then(() => true)
            .catch(() => new FileUploadError(`Impossible de supprimer: ${url}`));
    }

    async exists(url: string): Promise<boolean> {
        const filepath = path.join(process.cwd(), url);
        return existsSync(filepath);
    }

    private getExtension(filename: string): string {
        const parts = filename.split('.');
        return parts.length > 1 ? parts[parts.length - 1] : 'bin';
    }
}