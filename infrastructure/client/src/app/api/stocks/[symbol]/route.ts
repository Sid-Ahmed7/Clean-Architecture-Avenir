import { transformQuoteToStock } from "@/lib/utils/stocks";
import { TwelveDataQuoteResponse } from "@/types/stock";
import { NextRequest, NextResponse } from "next/server";


const apiKey = process.env.TWELVE_DATA_API_KEY;
const baseUrl = process.env.TWELVE_DATA_API_URL;


export async function GET(request: NextRequest, {params} : {params: {symbol: string}}) {
    const {symbol} = params;

    if(!apiKey) {
        return NextResponse.json({
            error: "Api key is missing",
            stocks:  [],
            cached: false,
            cachedAt: new Date().toISOString(),
        }, {status: 500});
    }

    if (!symbol) {
        return NextResponse.json(
        {
            error: 'Missing symbol parameter',
            stocks: [],
            total: 0,
            cached: false,
            cachedAt: new Date().toISOString()
        },
        { status: 400 }
        );
    }


    try{
       const response = await fetch(`${baseUrl}/quote?symbol=${symbol.toUpperCase()}&apikey=${apiKey}`,
            {next: {revalidate: 60}}
        )
        if(!response.ok) {
             return NextResponse.json({
                error: `API returned status ${response.status}`,
                stocks: [],
                total: 0,
                cached: false,
                cachedAt: new Date().toISOString()
            },{  status: response.status }
            );
        }

        const data: TwelveDataQuoteResponse | { status: string; message?: string } = await response.json();  
        if (!data) {
            if ((data as any).status === "error" || !("symbol" in data)) {
            
                return NextResponse.json(
                    {
                        error: (data as any).message || 'Stock not found',
                        stocks: [],
                        total: 0,
                        cached: false,
                        cachedAt: new Date().toISOString()
                    },{ status: 404 }
                );
            }
        }

        const stock = transformQuoteToStock(data as TwelveDataQuoteResponse);
        return NextResponse.json({
            stocks: [stock],
            total: 1,
            cached: false,
            cachedAt: new Date().toISOString(),
            });
        } catch (err) {
            console.error("Error fetching stock:", err);

            return NextResponse.json(
            {
                error: err instanceof Error ? err.message : "Failed to fetch stock",
                stocks: [],
                total: 0,
                cached: false,
                cachedAt: new Date().toISOString(),
            },
            { status: 500 }
            );
        }
        }

