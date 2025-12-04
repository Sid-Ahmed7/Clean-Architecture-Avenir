import { Stock } from "./stock";

export interface StocksListResponse {
  stocks: Stock[];
  total: number;
  cached: boolean;
  cachedAt: string;
}