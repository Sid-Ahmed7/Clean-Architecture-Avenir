import { AltTextService } from "../../../../application/ports/services/news/AltTextService";

export class GenerateAltTextService implements AltTextService {

    public generateAltText(mediaUrl: string): string {
       const altText = mediaUrl.split("/").pop()?.replace(/\.[^/.]+$/, "") ?? "Media"
    return altText;
    }
} 