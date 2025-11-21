import { Content } from "./content";
import { Media } from "./media";

export type DisplayBlock = 
  | { type: "content"; data: Content; order: number }
  | { type: "media"; data: Media; order: number };
