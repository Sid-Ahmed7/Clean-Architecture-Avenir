import { z } from "zod";
import { NewsCategoryEnum } from "../../../../../../domain/enums/NewsCategoryEnum";
import { NewsPriorityEnum } from "../../../../../../domain/enums/NewsPriorityEnum";

export const createNewsSchema = z.object({
  title: z.string(),
  category: z.enum(NewsCategoryEnum),
  priority: z.enum(NewsPriorityEnum),
  tags: z.array(z.string()),
});
