import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";


interface DragAndDropZoneProps {
    onFilesSelect: (files: FileList) => void;
    isDragging: boolean;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    disabled?: boolean;
    maxSize: number;
}

export function DragAndDropZone({onFilesSelect, isDragging, onDragOver, onDragLeave, onDrop, disabled, maxSize} : DragAndDropZoneProps) {
    const t = useTranslations("media.dragDrop");
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(! e.target.files) {
            return;
        }
        
        onFilesSelect(e.target.files);
        e.target.value = '';
    }
    return (
    <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <label className={`flex flex-col items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <Upload 
          className={`mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
          size={40} 
        />
        <span className="text-sm text-gray-600 font-medium mb-1">
          {t("dropOrClick")}
        </span>
        <span className="text-xs text-gray-500">
          {t("acceptedTypes", { maxSize })}
        </span>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </label>
    </div>
  );
}