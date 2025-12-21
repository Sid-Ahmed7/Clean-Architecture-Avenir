import {MediaEntity} from "../../../../domain/entities/MediaEntity";

export interface AltTextService {
    generateAltText(mediaUrl: string) : string
}