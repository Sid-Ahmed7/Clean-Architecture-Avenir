import { MediaUploader } from "@/components/media/MediaUploader";
import { AlertCircle } from "lucide-react";

interface MediaContentProps {
    files: File[];
    onChange: (files: File[]) => void;
    disabled?: boolean;
    error?: string;
}

export function MediaContent({files, onChange, disabled, error} : MediaContentProps) {
    return (
            <div className="flex-1">
                <MediaUploader
                    onFilesSelected={onChange}
                    existingFiles={[]} 
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