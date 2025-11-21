import { NewsCategoryEnum, NewsPriorityEnum } from "@/types/news"
import z from "zod"

export const createNewsSchema = (t:(key: string) => string) => 
    z.object({
       title: z.string(),
       category: z.enum(NewsCategoryEnum),
       priority: z.enum(NewsPriorityEnum),
       tags: z.array(z.string()),
    })
export type CreateNewsModel = z.infer<ReturnType<typeof createNewsSchema>>;

