import { Media } from "./media";

export enum TypeBlock {
    TEXT = "TEXT",
    MEDIA = "MEDIA"
}


export interface BaseBlock {
    id: number;
    type: TypeBlock;
    order: number;
}

export interface TextBlock extends BaseBlock {
    type: TypeBlock.TEXT;
    content: string;
}

export interface MediaBlock extends BaseBlock {
    type: TypeBlock.MEDIA;
    files: File[];
     existingMedias?: Media[];
}

export type Block = TextBlock | MediaBlock;