import { Stock, TwelveDataQuoteResponse } from "@/types/stock";

export function transformQuoteToStock(quote: TwelveDataQuoteResponse) : Stock {
    const stock: Stock = {
        symbol: quote.symbol,
        name: quote.name,
        exchange: quote.exchange,
        micCode: quote.mic_code,
        currency: quote.currency,
        price: parseFloat(quote.close),
        open: parseFloat(quote.open),
        high: parseFloat(quote.high),
        low: parseFloat(quote.low),
        previousClose: parseFloat(quote.previous_close),
        change: parseFloat(quote.change),
        changePercent: parseFloat(quote.percent_change),
        volume: parseInt(quote.volume),
        averageVolume: parseInt(quote.average_volume),
        isMarketOpen: quote.is_market_open,
        lastUpdated: quote.datetime,
        timestamp: quote.timestamp,
    };
    if (quote.fifty_two_week) {
        stock.fiftyTwoWeek = {
        low: parseFloat(quote.fifty_two_week.low),
        high: parseFloat(quote.fifty_two_week.high),
        lowChange: parseFloat(quote.fifty_two_week.low_change),
        highChange: parseFloat(quote.fifty_two_week.high_change),
        lowChangePercent: parseFloat(quote.fifty_two_week.low_change_percent),
        highChangePercent: parseFloat(quote.fifty_two_week.high_change_percent),
        range: quote.fifty_two_week.range,
        };
    }

    if (quote.extended_price && quote.extended_change && quote.extended_percent_change) {
        stock.extendedHours = {
        price: parseFloat(quote.extended_price),
        change: parseFloat(quote.extended_change),
        changePercent: parseFloat(quote.extended_percent_change),
        timestamp: quote.extended_timestamp ? parseInt(quote.extended_timestamp) : 0,
        };
    }
    return stock;
}