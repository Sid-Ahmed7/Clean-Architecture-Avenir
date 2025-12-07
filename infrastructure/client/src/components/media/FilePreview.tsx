import { Edit2, ImageIcon, Save, Video, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { getMediaUrl } from "@/lib/utils/media";


interface FilePreviewProps {
    preview: string;
    fileName: string;
    size: number;
    type: "IMAGE" | "VIDEO";
    onRemove?: () => void;
    isUploadAlready?: boolean;
    caption?: string;
    onCaptionChange?: (mediaId: string, caption: string) => void;
    mediaId?: string
}

export function FilePreview({preview, fileName, size,type, onRemove, isUploadAlready, caption, onCaptionChange, mediaId}: FilePreviewProps) {
    
    const [isEditingCaption, setIsEditingCaption] = useState(false);
    const [captionValue, setCaptionValue] = useState(caption || "");

    useEffect(() => {
            setCaptionValue(caption || "");  
            console.log("catopn", caption)
        }, [caption])

    const formatFileSize = (fileSize : number) : string => {
        
        if (fileSize === 0) {
            return '0 B'
        }

        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(fileSize) / Math.log(1024));
        const resultSize = parseFloat((fileSize / Math.pow(1024, i)).toFixed(2));
        const formatType = `${resultSize} ${sizes[i]}`;

        return formatType;
    }

    const handleAddCaption = () => {
        if(onCaptionChange && mediaId) {
              onCaptionChange(mediaId,captionValue);

        }
        setIsEditingCaption(false);
    }

     return (
        <div className="relative group">
        <div className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${isUploadAlready ? 'border-green-200' : 'border-gray-200'}`}>
            {type === "IMAGE" ? (
                
  <>
    {console.log("FilePreview src:", getMediaUrl(preview))}
    <Image
      src={getMediaUrl(preview)}
      alt={fileName}
      fill
      className="w-full h-full object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
      unoptimized
    />
  </>            ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
            <video 
            src={getMediaUrl(preview)} 
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            />                
            <span className="text-xs text-purple-700 font-medium">Vidéo</span>
            </div>
            )}
        </div>

        {onRemove && (
            <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Supprimer"
            >
            <X size={14} />
            </button>
        )}

        <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
            isUploadAlready ? 'bg-green-500 text-white' : type === "IMAGE" ? 'bg-blue-500 text-white': 'bg-purple-500 text-white'
            }`}>
            {isUploadAlready ? ('Uploadé') : (
                <>
                {type === "IMAGE" ? <ImageIcon size={12} /> : <Video size={12} />}
                </>
            )}
            </span>
        </div>


        <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-700 font-medium truncate" title={fileName}>
            {fileName}
            </p>
            <p className="text-xs text-gray-500">
            {formatFileSize(size)}
            </p>
            
            {isUploadAlready && onCaptionChange && (
                <div className="mt-60 ml-50">
                    {!isEditingCaption ? (
                        <div className="flex items-center gap-16">
                            <p className="text-xs text-gray-600 truncate flex-1" title={caption || "Aucune légende"}>
                                {caption || "Aucune légende"}
                            </p>
                            <Button
                                type="button"
                                onClick={() => setIsEditingCaption(true)}
                                variant="primary"                        >
                                <Edit2 size={12} /> Modifier la legende
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <div>
                            <input
                                type="text"
                                value={captionValue}
                                onChange={(e) => {
                                    console.log("Input caption value:", e.target.value);
                                    setCaptionValue(e.target.value);
                                }}
                                placeholder="Ajouter une légende..."
                                className="text-xs border rounded px-2 py-1 w-full"
                            />
                            </div>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={handleAddCaption}
                                    className="text-green-600 hover:text-green-700 p-1 bg-green-50 rounded w-8 h-8"
                                    title="Enregistrer"
                                >
                                    <Save size={12} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCaptionValue(caption || "");
                                        setIsEditingCaption(false);
                                    }}
                                    className="text-gray-600 hover:text-gray-700 p-1 bg-gray-50 rounded"
                                    title="Annuler"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
        </div>
  );
}