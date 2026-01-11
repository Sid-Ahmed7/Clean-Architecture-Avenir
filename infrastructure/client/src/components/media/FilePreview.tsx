import { Edit2, ImageIcon, Save, Video, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { getMediaUrl } from "@/lib/utils/media";
import { useTranslations } from 'next-intl';


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
    const t = useTranslations('media.filePreview');
    const [isEditingCaption, setIsEditingCaption] = useState(false);
    const [captionValue, setCaptionValue] = useState(caption || "");

    useEffect(() => {
            setCaptionValue(caption || "");
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
        <div className="flex flex-col">
        <div className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${isUploadAlready ? 'border-green-200' : 'border-gray-200'} group`}>
            {type === "IMAGE" ? (

  <>
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
            <span className="text-xs text-purple-700 font-medium">{t('video')}</span>
            </div>
            )}
        </div>

        {onRemove && (
            <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title={t('remove')}
            >
            <X size={14} />
            </button>
        )}

        <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
            isUploadAlready ? 'bg-green-500 text-white' : type === "IMAGE" ? 'bg-blue-500 text-white': 'bg-purple-500 text-white'
            }`}>
            {isUploadAlready ? (t('uploaded')) : (
                <>
                {type === "IMAGE" ? <ImageIcon size={12} /> : <Video size={12} />}
                </>
            )}
            </span>
        </div>


        <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-700 font-medium truncate" title={fileName}>
            {fileName}
            </p>
            <p className="text-xs text-gray-500">
            {formatFileSize(size)}
            </p>

            {isUploadAlready && onCaptionChange && (
                <div className="mt-2 space-y-1">
                    {!isEditingCaption ? (
                        <>
                            <p className="text-xs text-gray-600 italic truncate" title={caption || t('noCaption')}>
                                {caption || t('noCaption')}
                            </p>
                            <Button
                                type="button"
                                onClick={() => setIsEditingCaption(true)}
                                variant="primary"
                                size="sm"
                                fullWidth
                            >
                                <Edit2 size={12} /> {t('editCaption')}
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            <input
                                type="text"
                                value={captionValue}
                                onChange={(e) => {
                                    setCaptionValue(e.target.value);
                                }}
                                placeholder={t('addCaption')}
                                className="text-xs border rounded px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={handleAddCaption}
                                    className="flex-1 text-xs text-white bg-green-500 hover:bg-green-600 px-2 py-1.5 rounded flex items-center gap-1 justify-center transition-colors"
                                    title={t('save')}
                                >
                                    <Save size={12} /> {t('save')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCaptionValue(caption || "");
                                        setIsEditingCaption(false);
                                    }}
                                    className="flex-1 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 px-2 py-1.5 rounded flex items-center gap-1 justify-center transition-colors"
                                    title={t('cancel')}
                                >
                                    <X size={12} /> {t('cancel')}
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
