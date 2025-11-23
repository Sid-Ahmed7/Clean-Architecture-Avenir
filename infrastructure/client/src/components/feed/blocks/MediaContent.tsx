import { MediaUploader } from "@/components/media/MediaUploader";
import { Media } from "@/types/media";
import { UploadedFile } from "@/types/uploadedFile";
import { url } from "inspector";
import { AlertCircle } from "lucide-react";

interface MediaContentProps {
    files: File[];
    existingMedias?: Media[]
    onChange: (files: File[]) => void;
    disabled?: boolean;
    error?: string;
}

export function MediaContent({files, existingMedias = [], onChange, disabled, error} : MediaContentProps) {
    const getExistingMedias : UploadedFile[]= existingMedias?.map(media => ({
        url: media.url,
        filename: media.altIndex ?? "",
        size: media.size,
        type: media.type === 'IMAGE' ? 'IMAGE' : "VIDEO",
        mimeType: media.mimeType
    })) ?? [] 
  
    return (
            <div className="flex-1">
                <MediaUploader
                    onFilesSelected={onChange}
                    existingFiles={getExistingMedias} 
                    maxSize={50}
                    disabled={disabled}
                />
                {error && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                    </p>
                )}
            </div>
    )
}