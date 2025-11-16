import { FilePreview } from "./FilePreview";
import Button from "../ui/Button";

interface FileGridProps {
  title: string;
  files: Array<{
    preview: string;
    filename: string;
    size: number;
    type: "IMAGE" | "VIDEO";
  }>;
  onRemove?: (index: number) => void;
  onClearAll?: () => void;
  isUploadAlready?: boolean;
}

export function FileGrid({title,files,onRemove,onClearAll,isUploadAlready = false}: FileGridProps) {
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
            preview={file.preview}
            fileName={file.filename}
            size={file.size}
            type={file.type}
            onRemove={onRemove ? () => onRemove(index) : undefined}
            isUploadAlready={isUploadAlready}
          />
        ))}
      </div>
    </div>
  );
}