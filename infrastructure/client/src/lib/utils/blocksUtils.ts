import { Block } from "@/types/contentBlock";
import { DisplayBlock } from "@/types/displayBlock";

export const getBlockKey = (block: Block): string => {
return `${block.id}`;
};

export const getNextBlockOrder  = (blocks: Block[]): number => {
    if(blocks.length === 0) {
        return 0;
    }
    const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
    return sortedBlocks[sortedBlocks.length - 1].order + 1;
}

export const sortBlock = (blocks: DisplayBlock[]): DisplayBlock[] => {
  return [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
export const idBlock = () => `temp-${crypto.randomUUID()}`;

