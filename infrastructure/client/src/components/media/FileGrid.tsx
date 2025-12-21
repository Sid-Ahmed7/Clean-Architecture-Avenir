import { FilePreview } from "./FilePreview";
import Button from "../ui/Button";
import { Files } from "@/types/files";
import { getMediaUrl } from "@/lib/utils/media";

interface FileGridProps {
  title: string;
  files: Array<Files>
  onRemove?: (index: number) => void;
  onClearAll?: () => void;
  isUploadAlready?: boolean;
  onCaptionChange?: (mediaId: string, caption: string) => void;
}

export function FileGrid({title,files,onRemove,onClearAll,isUploadAlready = false, onCaptionChange}: FileGridProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {title} ({files.length})
        </p>
        {onClearAll && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClearAll}
          >
            Tout supprimer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <FilePreview
            key={index}
            preview={getMediaUrl(file.preview)}
            fileName={file.filename}
            size={file.size}
            type={file.type}
            caption={file.caption}
            onRemove={onRemove ? () => onRemove(index) : undefined}
            isUploadAlready={isUploadAlready}
            onCaptionChange={onCaptionChange && file.mediaId
              ? (mediaId, caption) => {
                  onCaptionChange(mediaId, caption);
                }
              : undefined
            }


            mediaId={file.mediaId}
          />
        ))}
      </div>
    </div>
  );
}