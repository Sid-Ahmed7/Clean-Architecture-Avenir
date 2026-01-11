import { MediaFile } from "@/types/mediaFile";
import { UploadedFile } from "@/types/uploadedFile";
import { useState } from "react";
import { DragAndDropZone } from "./DragAndDropZone";
import { X } from "lucide-react";
import { FileGrid } from "./FileGrid";
import { useTranslations } from "next-intl";

interface MediaUploaderProps {
    onFilesSelected: (files: File[]) => void;
    existingFiles?: UploadedFile[];
    maxSize?: number;
    disabled?: boolean;
    onCaptionUpdate?: (mediaId: string, caption: string) => void;
}

export function MediaUploader({onFilesSelected, existingFiles = [],maxSize = 10, disabled =false, onCaptionUpdate} : MediaUploaderProps){
    const t = useTranslations("media.uploader");
    const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
    const [isDragging, setDragging] =  useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateTypeFile = (file: File) => {
        const image = file.type.startsWith('image/');
        const video = file.type.startsWith('video/');

        if(!image && !video) {
            setError(t("errorNotMedia", { fileName: file.name }));
            return false; 
        }

        const size = maxSize * 1024 * 1024;
        if(file.size > size) {
            setError(t("errorMaxSize", { fileName: file.name, maxSize }));
            return false;
        }

        return true;
    }

    const getFileType = (file: File | UploadedFile): "IMAGE" | "VIDEO" => {
        const typeFile = file.type;
        return typeFile.startsWith('image/') ? "IMAGE" : "VIDEO";
    }

    const updateFiles = (newFiles: MediaFile[]) => {
        const updated = [...selectedFiles, ...newFiles];
        setSelectedFiles(updated);
        onFilesSelected(updated.map(mf => mf.file));
    }

    const processFiles = (files: FileList) => {
        const filesArray = Array.from(files);

        const validFiles: MediaFile[] = [];
        let processedCount = 0;

        filesArray.forEach(file => {
            if(!validateTypeFile(file)) {
                processedCount++;
                return;
            }

            const type = getFileType(file);

            if(type === "IMAGE") {
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    validFiles.push({file, preview: fileReader.result as string})
                    processedCount++;
                    if (processedCount === filesArray.length) {
                        updateFiles(validFiles);
                    }
                };
                fileReader.readAsDataURL(file);
            } else {
                validFiles.push({file, preview: URL.createObjectURL(file)});
                processedCount++;
                if (processedCount === filesArray.length) {
                    updateFiles(validFiles);
                }
            }
        });
    };

    const handleDrop =(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);

        if(disabled) {
            return;
        }
        processFiles(e.dataTransfer.files);
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        if(!disabled) {
            setDragging(true);
        }
    }

    const handleDragLeave = () => {
        setDragging(false);
    }

    const removeFile = (index: number) => {
        const file = selectedFiles[index];
        const fileType = getFileType(file.file);

        if(fileType === "VIDEO") {
            URL.revokeObjectURL(file.preview);
        }

        const updated = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updated);
        onFilesSelected(updated.map(mf => mf.file));
    }

    const clearAll = () => {
        selectedFiles.forEach(file => {
            const fileType = getFileType(file.file);
            if (fileType === "VIDEO") {
                URL.revokeObjectURL(file.preview);
            }
        });
        setSelectedFiles([]);
        onFilesSelected([]);
        setError(null);
    };
    
    const handleCaptionChange = (mediaId: string, caption: string) => {
        if (onCaptionUpdate) {
            onCaptionUpdate(mediaId, caption);
        }
    };


    const newFilesForGrid = selectedFiles.map(mediaFile => ({
        preview: mediaFile.preview,
        filename: mediaFile.file.name,
        size: mediaFile.file.size,
        type: getFileType(mediaFile.file)
    }))

    const existingFilesForGrid = existingFiles.map(uploadFile => ({
        preview: uploadFile.url,
        filename: uploadFile.filename,
        size: uploadFile.size,
        type: uploadFile.type,
    caption: typeof uploadFile.caption === "string" ? uploadFile.caption : "",
        mediaId: uploadFile.id
    }))
   
    const totalFilesCount = existingFiles.length + selectedFiles.length;


  return (
    <div className="space-y-4">
      <DragAndDropZone
        onFilesSelect={processFiles}
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled}
        maxSize={maxSize}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <X size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto hover:bg-red-100 rounded p-1"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <FileGrid
        title={t("existingFiles")}
        files={existingFilesForGrid}
        isUploadAlready={true}
        onCaptionChange={handleCaptionChange}
      />

      <FileGrid
        title={t("newFiles")}
        files={newFilesForGrid}
        onRemove={removeFile}
        onClearAll={clearAll}
      />

      {totalFilesCount > 0 && (
        <div className="text-xs text-gray-500 text-center">
          Total: {totalFilesCount} fichier{totalFilesCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}