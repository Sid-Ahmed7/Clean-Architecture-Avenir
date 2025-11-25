export class MediaValidation {

    public static readonly IMAGE_MAX_SIZE = 10 * 1024 * 1024; 
    public static readonly VIDEO_MAX_SIZE = 100 * 1024 * 1024;

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

}