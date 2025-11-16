import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();
const uploadLimits = {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 10,
    fieldSize: 2 * 1024 * 1024,
    fields: 20,
};
const allowedMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm',
];

export const mediaUpload = (fieldName: string) => {
    const upload = multer({
        storage,
        limits: uploadLimits,
        fileFilter: (req: Request, file: Express.Multer.File, cb) => {
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(`File type not authorized: ${file.mimetype}. Accepted Type: ${allowedMimeTypes.join(", ")}`)
                );
            }
        },
    }).single(fieldName); 

    return (req: Request, res: Response, next: NextFunction) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    };
};
