import { StockOrderEntity } from "../../domain/entities/StockOrderEntity";

export interface OrderMatch {
    buy: StockOrderEntity;
    sell: StockOrderEntity;
}