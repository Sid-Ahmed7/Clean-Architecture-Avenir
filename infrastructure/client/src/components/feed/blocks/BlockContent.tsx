import { Block, TypeBlock } from "@/types/contentBlock";
import { GripVertical, Trash2 } from "lucide-react";
import { BlocksBadge } from "./BlocksBadge";
import { TextContent } from "./TextContent";
import { MediaContent } from "./MediaContent";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

interface BlockContentProps {
    block: Block;
    newsId: number;
    onUpdate: (block: Block) => void;
    onRemove: () => void;
    disabled?: boolean;
    dragAndDropHandle: DraggableProvidedDragHandleProps  | null
}

export function BlockContent({block, newsId, onUpdate, onRemove, disabled, dragAndDropHandle}: BlockContentProps) {
    return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-3 hover:shadow-md transition-shadow">
      <div
        {...dragAndDropHandle}
        className="cursor-grab active:cursor-grabbing flex-shrink-0"
      >
        <GripVertical className="text-gray-400 hover:text-gray-600" size={20} />
      </div>

      <BlocksBadge order={block.order} />

      {block.type === TypeBlock.TEXT && (
        <TextContent
          content={block.content}
          onChange={(content) => onUpdate({ ...block, content })}
          disabled={disabled}
        />
      )}

      {block.type === TypeBlock.MEDIA && (
        <MediaContent
          files={block.files}
          existingMedias={block.existingMedias}
          newsId={newsId}
          onChange={(files) => onUpdate({ ...block, files })}
          disabled={disabled}
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        title="Supprimer ce bloc"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
