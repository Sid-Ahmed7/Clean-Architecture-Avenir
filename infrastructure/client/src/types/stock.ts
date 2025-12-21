
export interface FiftyTwoWeek {
    low: number;
    high: number;
    lowChange: number;
    highChange: number;
    lowChangePercent: number;
    highChangePercent: number;
    range: string;
}
export interface ExtendHours {
    price: number;
    change: number;
    changePercent: number;
    timestamp: number;
}



export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  micCode?: string;
  currency: string;
  country?: string;
  type?: string;

  price: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;

  change: number;
  changePercent: number;

  volume?: number;
  averageVolume?: number;

  isMarketOpen: boolean;
  lastUpdated: string;
  timestamp: number;

  fiftyTwoWeek?: FiftyTwoWeek;

  extendedHours?: ExtendHours
}


export interface TwelveDataQuoteResponse {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  datetime: string;
  timestamp: number;
  last_quote_at: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  rolling_1d_change?: string;
  rolling_7d_change?: string;
  rolling_change?: string;
  is_market_open: boolean;
  fifty_two_week?:FiftyTwoWeek;
  extended_change?: string;
  extended_percent_change?: string;
  extended_price?: string;
  extended_timestamp?: string;
}

