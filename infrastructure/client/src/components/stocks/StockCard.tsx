import { Stock } from "@/types/stock";
import { StockHeader } from "./structure/StockHeader";
import { StockPrice } from "./structure/StockPrice";
import { StocksStats } from "./structure/StockStats";
import { StockFiftyTwoWeek} from "./structure/StockFiftyTwoWeek";
import { StockVolume } from "./structure/StockVolume";
import { StockActions } from "./structure/StockActions";

interface StockCardProps {
    stock: Stock;
    onBuy?: (symbol: string) => void;
    onSell?: (symbol: string) => void;

}

export function StockCard({stock, onBuy, onSell}: StockCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <StockHeader
                symbol={stock.symbol}
                name={stock.name}
                exchange={stock.exchange}
                isMarketOpen={stock.isMarketOpen}
            />

            <StockPrice
                price={stock.price}
                currency={stock.currency}
                change={stock.change}
                changePercent={stock.changePercent}
                extendedHours={stock.extendedHours}
                isMarketOpen={stock.isMarketOpen}
            />

            <StocksStats
                open={stock.open}
                previousClose={stock.previousClose}
                high={stock.high}
                low={stock.low}
            />

            {stock.fiftyTwoWeek && (
                <StockFiftyTwoWeek
                    fiftyTwoWeek={stock.fiftyTwoWeek}
                />
            )}
            <StockVolume
                volume={stock.volume}
                averageVolume={stock.averageVolume}
            />

            <StockActions
                symbol={stock.symbol}
                onBuy={onBuy}
                onSell={onSell}
                lastUpdated={stock.lastUpdated}
            />
        </div>
    )
}