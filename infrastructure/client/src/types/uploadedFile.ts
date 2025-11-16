export interface UploadedFile {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    type: "IMAGE" | "VIDEO";
}