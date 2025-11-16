import { ImageIcon, Video, X } from "lucide-react";


interface FilePreviewProps {
    preview: string;
    fileName: string;
    size: number;
    type: "IMAGE" | "VIDEO";
    onRemove?: () => void;
    isUploadAlready?: boolean;
}

export function FilePreview({preview, fileName, size,type, onRemove, isUploadAlready}: FilePreviewProps) {
    
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

     return (
        <div className="relative group">
        <div className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${isUploadAlready ? 'border-green-200' : 'border-gray-200'}`}>
            {type === "IMAGE" ? (
            <img src={preview} alt={fileName} className="w-full h-full object-cover" />
            ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                <Video className="text-purple-600 mb-2" size={32} />
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
        </div>
        </div>
  );
}