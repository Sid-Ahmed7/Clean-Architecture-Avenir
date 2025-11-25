export interface UploadedFile {
    id?: number;
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    type: "IMAGE" | "VIDEO";
    caption?: number;
}