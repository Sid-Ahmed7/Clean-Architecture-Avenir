import {NewsCategoryEnum} from "../../domain/enums/NewsCategoryEnum";
import {NewsPriorityEnum} from "../../domain/enums/NewsPriorityEnum";

export interface CreateNews {
  title: string;
  category:NewsCategoryEnum ;
  priority?: NewsPriorityEnum; 
  tags: string[];
}
