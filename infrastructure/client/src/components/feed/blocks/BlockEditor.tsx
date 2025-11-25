import { Block, TypeBlock } from "@/types/contentBlock";
import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { BlockToolbar } from "./BlockToolbar";
import { AlertCircle } from "lucide-react";
import { BlockContent } from "./BlockContent";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils/media";
import { getBlockKey } from "@/lib/utils/blocksUtils";

interface BlockEditorProps {
    onChange: (blocks: Block[]) => void;
    initialBlocks?: Block[];
    newsId?: number;
    disabled?: boolean;
    error?: string;
}

export function BlockEditor({newsId, onChange, initialBlocks, disabled, error}: BlockEditorProps) {
    const blockId = useRef(-1);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const hasInitialized = useRef(false);

    useEffect(() => {
    if(initialBlocks && initialBlocks.length > 0 && !hasInitialized.current) {
        const ordered = initialBlocks.sort((a,b) => a.order - b.order)
        setBlocks(ordered);
        hasInitialized.current = true;
    } else {
            setBlocks([
                {
                id: blockId.current--,
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
    console.log("Ajout d'un block");
    console.log("Blocks actuels:", blocks.length);
    console.log("Nouvel order:", blocks.length);

    const newBlock: Block = {
        id: blockId.current--,
        type,
        order: blocks.length > 0 ? Math.max(...blocks.map(b => b.order ?? 0)) + 1 : 0,
        ...(type === TypeBlock.TEXT ? {content: ""} : {files: [], existingMedias: []})
    } as Block

    console.log(" Nouveau block créé:", newBlock);
    
    setBlocks([...blocks, newBlock]);
}

    const updateBlock =(id: string, updateBlock: Block) => {
        setBlocks(blocks.map((block) => (getBlockKey(block) === id ? updateBlock : block)))
    }

    const removeBlock = (id: string) =>{
        const filteredBlocks = blocks.filter((block) => getBlockKey(block) !== id)
        setBlocks(filteredBlocks);
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
                key={getBlockKey(block)}
                draggableId={getBlockKey(block)}
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
                      newsId={newsId!}
                      onUpdate={(updated) => updateBlock(getBlockKey(block), updated)}
                      onRemove={() => removeBlock(getBlockKey(block))}
                      disabled={disabled}
                      dragAndDropHandle={provided.dragHandleProps}
                    />
                    {block.type === TypeBlock.MEDIA && block.existingMedias && block.existingMedias?.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {block.existingMedias.map((media) => (
                          <Image
                            key={media.id}
                            src={getMediaUrl(media.url)}
                            alt={media.altText}
                            className="w-24 h-24 object-cover rounded"
                            width={800} 
                            height={288}
                            loading="lazy"
                            unoptimized
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

    {blocks.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        Aucun bloc. Ajoutez-en un pour commencer !
      </div>
    )}

    <div className="text-xs text-gray-500 text-center">
      {blocks.length} bloc{blocks.length > 1 ? 's' : ''} • Glissez-déposez pour réorganiser
    </div>
  </div>
);

}