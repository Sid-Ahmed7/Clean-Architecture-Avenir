"use client";

import { StockCard } from "@/components/stocks/StockCard";
import { Stock } from "@/types/stock";
import { useEffect, useState } from "react";


export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await fetch("/api/stocks");
        const data = await res.json();

        if (res.ok) {
          setStocks(data.stocks);
        } else {
          setError(data.error || "Failed to fetch stocks");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch stocks");
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading stocks...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stocks.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
}
