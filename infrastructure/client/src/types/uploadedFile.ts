export interface UploadedFile {
    id?: string;
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    type: "IMAGE" | "VIDEO";
    caption?: string;
}