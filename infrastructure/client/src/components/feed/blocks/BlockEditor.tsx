import { Block, TypeBlock } from "@/types/contentBlock";
import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { BlockToolbar } from "./BlockToolbar";
import { AlertCircle } from "lucide-react";
import { BlockContent } from "./BlockContent";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils/media";

interface BlockEditorProps {
    onChange: (blocks: Block[]) => void;
    initialBlocks?: Block[];
    disabled?: boolean;
    error?: string;
}

export function BlockEditor({onChange, initialBlocks, disabled, error}: BlockEditorProps) {
    const blockId = useRef(1);
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        if(initialBlocks && initialBlocks?.length > 0) {
            setBlocks(initialBlocks);
        } else {
            setBlocks([
                {
                id: blockId.current++,
                type: TypeBlock.TEXT,
                order: 0,
                content: ""
                }
            ])
        }
    }, [initialBlocks]);

    useEffect(() => {
        onChange(blocks);
    }, [blocks,  onChange])

    const onAddBlock = (type: TypeBlock) => {
        const newBlock: Block = {
            id: blockId.current++,
            type,
            order: blocks.length,
            ...(type === TypeBlock.TEXT ? {content: ""} : {files: []})
        } as Block

        setBlocks([...blocks, newBlock]);
    }

    const updateBlock =(id: string, updateBlock: Block) => {
        setBlocks(blocks.map((block) => (block.id.toString() === id ? updateBlock : block)))
    }

    const removeBlock = (id: string) =>{
        const filtered = blocks.filter((block) => block.id.toString() !== id)
        const reordered = filtered.map((block, index) => ({...block, order: index}));
        setBlocks(reordered);
    }

    const handleDragEnd = (result: DropResult) => {
        if(!result.destination) {
            return;
        }
        const items = Array.from(blocks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const reordered = items.map((item, index) => ({
            ...item,
            order: index,
        }));

    setBlocks(reordered);
    }
return (
  <div className="space-y-4">
    <BlockToolbar onAddBlock={onAddBlock} disabled={disabled} />
    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )}

    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="blocks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {blocks.map((block, index) => (
              <Draggable
                key={block.id}
                draggableId={block.id.toString()}
                index={index}
                isDragDisabled={disabled}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <BlockContent
                      block={block}
                      onUpdate={(updated) => updateBlock(block.id.toString(), updated)}
                      onRemove={() => removeBlock(block.id.toString())}
                      disabled={disabled}
                      dragAndDropHandle={provided.dragHandleProps}
                    />
                    {block.type === TypeBlock.MEDIA && block.existingMedias && block.existingMedias?.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {block.existingMedias.map((media) => (
                          <Image
                            key={media.id}
                            src={getMediaUrl(media.url)}
                            alt={media.altIndex || ""}
                            className="w-24 h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>

    {/* Message quand il n’y a aucun bloc */}
    {blocks.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        Aucun bloc. Ajoutez-en un pour commencer !
      </div>
    )}

    {/* Compteur et instructions */}
    <div className="text-xs text-gray-500 text-center">
      {blocks.length} bloc{blocks.length > 1 ? 's' : ''} • Glissez-déposez pour réorganiser
    </div>
  </div>
);

}