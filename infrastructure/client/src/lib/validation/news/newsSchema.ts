import { NewsCategoryEnum, NewsPriorityEnum } from "@/types/news"
import z from "zod"

export const newsSchema = (t:(key: string) => string) => 
    z.object({
        id: z.number(),
       title: z.string(),
       category: z.enum(NewsCategoryEnum),
       priority: z.enum(NewsPriorityEnum),
       tags: z.array(z.string()),
       views: z.number(),
       createdAt: z.string(),
       updatedAt: z.string().optional(),
    })
export type NewsModel = z.infer<ReturnType<typeof newsSchema>>;

