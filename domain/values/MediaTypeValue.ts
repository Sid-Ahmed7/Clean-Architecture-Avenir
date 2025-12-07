import { InvalidMediaTypeError } from "../errors/InvalidMediaTypeError";

export class MediaTypeValue {
    public static readonly IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    public static readonly VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100 MB

    public static readonly ALLOWED_IMAGE_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    public static readonly ALLOWED_VIDEO_TYPES = [
        'video/mp4',
        'video/webm',
    ];

    public static from(mimeType: string, fileSize: number): MediaTypeValue | InvalidMediaTypeError {
        if (!mimeType || mimeType.trim().length === 0) {
            return new InvalidMediaTypeError('Media type cannot be empty');
        }

        const isImage = this.ALLOWED_IMAGE_TYPES.includes(mimeType);
        const isVideo = this.ALLOWED_VIDEO_TYPES.includes(mimeType);

        if (!isImage && !isVideo) {
            return new InvalidMediaTypeError(
                `Unsupported media type: ${mimeType}. Allowed types: ${[...this.ALLOWED_IMAGE_TYPES, ...this.ALLOWED_VIDEO_TYPES].join(', ')}`
            );
        }

        if (isImage && fileSize > this.IMAGE_MAX_SIZE) {
            return new InvalidMediaTypeError(
                `Image size exceeds maximum allowed size of ${this.IMAGE_MAX_SIZE / (1024 * 1024)} MB`
            );
        }

        if (isVideo && fileSize > this.VIDEO_MAX_SIZE) {
            return new InvalidMediaTypeError(
                `Video size exceeds maximum allowed size of ${this.VIDEO_MAX_SIZE / (1024 * 1024)} MB`
            );
        }

        return new MediaTypeValue(mimeType, fileSize);
    }

    private constructor(
        public readonly mimeType: string,
        public readonly fileSize: number
    ) {}

    public isImage(): boolean {
        return MediaTypeValue.ALLOWED_IMAGE_TYPES.includes(this.mimeType);
    }

    public isVideo(): boolean {
        return MediaTypeValue.ALLOWED_VIDEO_TYPES.includes(this.mimeType);
    }
}
