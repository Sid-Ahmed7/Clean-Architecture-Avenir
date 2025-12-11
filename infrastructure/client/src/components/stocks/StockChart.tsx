"use client";

import { useMemo } from 'react';
import { Stock } from '@/types/stock';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';

interface ApiPriceChartProps {
  stock: Stock;
}

export function ApiPriceChart({ stock }: ApiPriceChartProps) {
  const isPositive = stock.change >= 0;

  const chartData = useMemo(() => {
    return generateDataFromStock(stock, 50);
  }, [stock]);

  const { minPrice, maxPrice } = useMemo(() => {
    const prices = chartData.map(d => d.price);
    return {
      minPrice: Math.min(...prices, stock.low) * 0.999,
      maxPrice: Math.max(...prices, stock.high) * 1.001
    };
  }, [chartData, stock]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="text-xs font-semibold">${payload[0].value.toFixed(2)}</p>
          <p className="text-xs text-gray-500">
            {new Date(payload[0].payload.timestamp).toLocaleTimeString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-gray-700">Évolution du prix (24h)</h4>
        <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '↑' : '↓'} {stock.changePercent.toFixed(2)}%
        </span>
      </div>
      
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp);
                return `${date.getHours()}h`;
              }}
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
              tick={{ fill: '#6b7280' }}
            />
            
            <YAxis 
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
              tick={{ fill: '#6b7280' }}
              width={60}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine 
              y={stock.open} 
              stroke="#9ca3af" 
              strokeDasharray="5 5"
              label={{ 
                value: `Open: $${stock.open.toFixed(2)}`, 
                position: 'insideTopLeft',
                fill: '#6b7280',
                fontSize: 10
              }}
            />
            
            <ReferenceLine 
              y={stock.high} 
              stroke="#10b981" 
              strokeDasharray="3 3"
              label={{ 
                value: `High: $${stock.high.toFixed(2)}`, 
                position: 'insideTopLeft',
                fill: '#10b981',
                fontSize: 10
              }}
            />
            
            <ReferenceLine 
              y={stock.low} 
              stroke="#ef4444" 
              strokeDasharray="3 3"
              label={{ 
                value: `Low: $${stock.low.toFixed(2)}`, 
                position: 'insideBottomLeft',
                fill: '#ef4444',
                fontSize: 10
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPrice)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-gray-500">Open</div>
          <div className="font-semibold text-gray-900">${stock.open.toFixed(2)}</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="text-green-600">High</div>
          <div className="font-semibold text-green-700">${stock.high.toFixed(2)}</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded">
          <div className="text-red-600">Low</div>
          <div className="font-semibold text-red-700">${stock.low.toFixed(2)}</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="text-blue-600">Close</div>
          <div className={`font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
            ${stock.price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateDataFromStock(
  stock: Stock,
  points: number
): Array<{ timestamp: number; price: number }> {
  const data: Array<{ timestamp: number; price: number }> = [];
  const now = Date.now();
  const timeStep = (24 * 60 * 60 * 1000) / points; 
  
  const startPrice = stock.previousClose;
  const endPrice = stock.price;
  const totalChange = endPrice - startPrice;
  
  const volatility = Math.abs(totalChange) * 0.2; 
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const trend = startPrice + totalChange * progress;
    const random = (Math.random() - 0.5) * volatility;
    const momentum = i > 0 ? (data[i - 1].price - startPrice) * 0.05 : 0;
    
    let price = trend + random + momentum;
    price = Math.max(stock.low, Math.min(stock.high, price));
    
    data.push({
      timestamp: now - (points - i) * timeStep,
      price
    });
  }
  
  data[0].price = stock.previousClose;
  data[data.length - 1].price = stock.price;
  
  return data;
}