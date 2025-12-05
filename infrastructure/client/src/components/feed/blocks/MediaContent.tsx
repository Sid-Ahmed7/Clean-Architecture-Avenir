import { MediaUploader } from "@/components/media/MediaUploader";
import { useMediaMutations } from "@/hooks/useMedia";
import { Media } from "@/types/media";
import { UploadedFile } from "@/types/uploadedFile";
import { url } from "inspector";
import { AlertCircle } from "lucide-react";

interface MediaContentProps {
    files: File[];
    existingMedias?: Media[];
    newsId: string;
    onChange: (files: File[]) => void;
    disabled?: boolean;
    error?: string;
}

export function MediaContent({files, existingMedias = [], newsId, onChange, disabled, error} : MediaContentProps) {
    
    const {updateMedia} = useMediaMutations();
    
    
    const getExistingMedias : UploadedFile[]= existingMedias?.map(media => ({
        id: media.id,
        url: media.url,
        filename: media.altText,
        size: media.size,
        type: media.type === 'IMAGE' ? 'IMAGE' : "VIDEO",
        mimeType: media.mimeType,
        caption: media.caption
    })) ?? [] 
      const handleCaptionUpdate = (mediaId: string, caption: string) => {
        const mediaToUpdate = existingMedias.find(m => m.id === mediaId);
        if (mediaToUpdate) {
            updateMedia.mutate({
                media: { ...mediaToUpdate, caption },
                newsId
            });
        }else {
            console.error("Média non trouvé:", mediaId);
        }
    }
  
    return (
            <div className="flex-1">
                <MediaUploader
                    onFilesSelected={onChange}
                    existingFiles={getExistingMedias} 
                    maxSize={50}
                    disabled={disabled}
                    onCaptionUpdate={handleCaptionUpdate}
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