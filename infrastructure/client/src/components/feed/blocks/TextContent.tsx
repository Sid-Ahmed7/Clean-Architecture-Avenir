import { AlertCircle } from "lucide-react";

interface TextContentProps {
    content: string;
    onChange: (content: string) => void;
    disabled?: boolean;
    error?: string;
}

export function TextContent({content, onChange,disabled,error} : TextContentProps) {
    return (
        <div className="flex-1">
        <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tapez votre texte ici..."
            disabled={disabled}
            rows={6}
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-colors ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
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