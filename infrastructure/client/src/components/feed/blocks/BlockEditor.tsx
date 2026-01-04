import { Block, TypeBlock } from "@/types/contentBlock";
import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { BlockToolbar } from "./BlockToolbar";
import { AlertCircle } from "lucide-react";
import { BlockContent } from "./BlockContent";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils/media";
import { idBlock } from "@/lib/utils/blocksUtils";
import { useTranslations } from "next-intl";

interface BlockEditorProps {
  onChange: (blocks: Block[]) => void;
  initialBlocks?: Block[];
  newsId?: string;
  disabled?: boolean;
  error?: string;
}

export function BlockEditor({ newsId, onChange, initialBlocks, disabled, error }: BlockEditorProps) {
  const t = useTranslations("components.feed.blockEditor");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const previousBlocksRef = useRef<string>('');

  useEffect(() => {
    const blocksKey = JSON.stringify(initialBlocks?.map(b => b.id).sort() || []);

    if (previousBlocksRef.current === blocksKey && previousBlocksRef.current !== '') {
      return;
    }

    previousBlocksRef.current = blocksKey;

    if (initialBlocks && initialBlocks.length > 0) {
      const ordered = [...initialBlocks].sort((a, b) => a.order - b.order);
      console.log("BlockEditor: Mise à jour des blocs", ordered);
      setBlocks(ordered);
    } else if (previousBlocksRef.current === '') {
      setBlocks([
        {
          id: idBlock(),
          type: TypeBlock.TEXT,
          order: 0,
          content: ""
        }
      ]);
    }
  }, [initialBlocks]);

  useEffect(() => {
    onChange(blocks);
  }, [blocks, onChange])

  const onAddBlock = (type: TypeBlock) => {
    const newBlock: Block = {
      id: idBlock(),
      type,
      order: blocks.length > 0 ? Math.max(...blocks.map(b => b.order ?? 0)) + 1 : 0,
      ...(type === TypeBlock.TEXT ? { content: "" } : { files: [], existingMedias: [] })
    } as Block

    console.log(" Nouveau block créé:", newBlock);

    setBlocks([...blocks, newBlock]);
  }

  const updateBlock = (id: string, updateBlock: Block) => {
    setBlocks(blocks.map((block) => (block.id === id ? updateBlock : block)))
  }

  const removeBlock = (id: string) => {
    const filteredBlocks = blocks.filter((block) => block.id !== id).map((b, i) => ({ ...b, order: i }));
    setBlocks(filteredBlocks);
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
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
                  draggableId={block.id}
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
                        onUpdate={(updated) => updateBlock(block.id, updated)}
                        onRemove={() => removeBlock(block.id)}
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
          {t('noBlocks')}
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        {t('blocksCount', { count: blocks.length })}
      </div>
    </div>
  );

}