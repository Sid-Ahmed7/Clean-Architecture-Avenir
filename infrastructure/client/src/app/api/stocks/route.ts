import { SYMBOLS } from "@/constants/symbols";
import { transformQuoteToStock } from "@/lib/utils/stocks";
import { Stock, TwelveDataQuoteResponse } from "@/types/stock";
import { NextResponse } from "next/server";


let cachedStocks: Stock[] | null = null;
let cacheTime: number | null = null;
const apiKey = process.env.TWELVE_DATA_API_KEY;
const baseUrl = process.env.TWELVE_DATA_API_URL;

const CACHE_DURATION = Infinity;

export const dynamic = 'force-dynamic';

export async function GET() {
    const now = Date.now();
    if(cachedStocks && cacheTime && now - cacheTime < CACHE_DURATION) {
        const ageInMinutes = Math.floor((now - cacheTime) / 60000);
        return NextResponse.json({
            stocks: cachedStocks,
            total: cachedStocks.length,
            cached: true,
            cacheAgeMinutes: ageInMinutes,
            cachedAt: new Date(cacheTime).toISOString()
        });
    }
    
    if(!apiKey) {
        return NextResponse.json({
            error: "Api key is missing",
            stocks: cachedStocks || [],
            cached: false,
            cachedAt: cacheTime ? new Date(cacheTime).toISOString() : null,
        }, {status: 500});
    }

const symbols = SYMBOLS.join(',');


    try{
       const response = await fetch(`${baseUrl}/quote?symbol=${symbols}&apikey=${apiKey}`,
            {cache: 'no-store'}
        )
        if(!response.ok) {
            if(cachedStocks) {
                return NextResponse.json({
                    stocks: cachedStocks,
                    total: cachedStocks.length,
                    cached: true,
                    stale: true,
                    cachedAt: cacheTime ? new Date(cacheTime).toISOString() : null
                });
            }
            return NextResponse.json({
                error: `API returned status ${response.status}`,
                stocks: [],
                total: 0,
                cached: false,
                cachedAt: new Date().toISOString()
            },{  status: response.status }
            );
        }

        const data = await response.json();
        console.log('📥 Raw Twelve Data response:', JSON.stringify(data, null, 2));
        const stocks: Stock[] = [];

        for(const symbol of SYMBOLS) {
            const quoteData: TwelveDataQuoteResponse = data[symbol];
            console.log(` Processing ${symbol}:`, quoteData ? 'DATA FOUND' : 'NO DATA');

            if(quoteData) {
            try {
                console.log(`📊 Raw quote data for ${symbol}:`, JSON.stringify(quoteData, null, 2));
                const stock = transformQuoteToStock(quoteData);
                console.log(`Transformed stock for ${symbol}:`, stock);
                stocks.push(stock);
            } catch(err) {
                console.error(` Failed to transform stock ${symbol}:`, err);
                console.error('Raw data that failed:', JSON.stringify(quoteData, null, 2));
            }
            } else {
                console.warn(`⚠️ No data for ${symbol} in response`);
            }
        }

        console.log(`📦 Total stocks transformed: ${stocks.length}/${SYMBOLS.length}`);

        cachedStocks = stocks;
        cacheTime = now;
        return NextResponse.json({
            stocks: stocks,
            total: stocks.length,
            cached: false,
            cachedAt: new Date(cacheTime).toISOString()
        });
    } catch(err) {
        console.error('[STOCKS] Error:', err);
    }
    if(cachedStocks) {
        return NextResponse.json({
            stocks: cachedStocks,
            total: cachedStocks.length,
            cached: true,
            stale: true,
            cachedAt: cacheTime ? new Date(cacheTime).toISOString() : null
        });
    }
    return NextResponse.json({ 
        error: 'Failed to fetch stocks',
        stocks: [],
        total: 0,
        cached: false,
        cachedAt: new Date().toISOString()
      },{ status: 500 }
    );
}
