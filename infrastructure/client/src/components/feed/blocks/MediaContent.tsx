import { MediaUploader } from "@/components/media/MediaUploader";
import { useMediaMutations, useMediaByNewsId } from "@/hooks/useMedia";
import { Media } from "@/types/media";
import { UploadedFile } from "@/types/uploadedFile";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface MediaContentProps {
    files: File[];
    existingMedias?: Media[];
    newsId: string;
    onChange: (files: File[]) => void;
    disabled?: boolean;
    error?: string;
}

export function MediaContent({files, existingMedias = [], newsId, onChange, disabled, error} : MediaContentProps) {
    const tErrors = useTranslations("generalErrors.mediaContent");
    const {updateMedia} = useMediaMutations();
    const { data: mediasFromCache } = useMediaByNewsId(newsId);

    const mediasToDisplay = mediasFromCache && mediasFromCache.length > 0 ? mediasFromCache : existingMedias;

    const getExistingMedias : UploadedFile[]= mediasToDisplay?.map(media => ({
        id: media.id,
        url: media.url,
        filename: media.altText,
        size: media.size,
        type: media.type === 'IMAGE' ? 'IMAGE' : "VIDEO",
        mimeType: media.mimeType,
        caption: media.caption
    })) ?? [] 
      const handleCaptionUpdate = (mediaId: string, caption: string) => {
        const mediaToUpdate = mediasToDisplay.find(m => m.id === mediaId);
        if (mediaToUpdate) {
            updateMedia.mutate({
                media: { ...mediaToUpdate, caption },
                newsId
            });
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