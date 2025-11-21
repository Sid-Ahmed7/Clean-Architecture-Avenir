import { News } from "@/types/news";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface FeedStatsProps {
    topFeeds: News[];
}

export function FeedStats({topFeeds} : FeedStatsProps) {
    const data = [...topFeeds]
        .sort((a,b) => b.views - a.views)
        .slice(0, 5)
        .map((n) => ({
            name: n.title.length > 30 ? n.title.substring(0, 30) + '...' : n.title, 
            views: n.views,
            fullName: n.title
        }));

 return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Top 5 Articles</h3>
                <p className="text-sm text-gray-500">Les actualités les plus consultées</p>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                    data={data} 
                    margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
                >
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6}/>
                        </linearGradient>
                    </defs>
                    
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#e5e7eb" 
                        vertical={false}
                    />
                    
                    <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11, fill: '#6b7280' }} 
                        interval={0} 
                        angle={-25} 
                        textAnchor="end"
                        height={80}
                        stroke="#9ca3af"
                    />
                    
                    <YAxis 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={(value) => value.toLocaleString()}
                        stroke="#9ca3af"
                    />
                    
                    <Tooltip 
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                        <p className="font-semibold text-gray-900 mb-2">
                                            {payload[0].payload.fullName}
                                        </p>
                                        <p className="text-blue-600 font-medium">
                                            {payload[0].value.toLocaleString()} vues
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                        cursor={{ fill: '#f3f4f6', opacity: 0.3 }}
                    />
                    
                    <Bar 
                        dataKey="views" 
                        fill="url(#colorViews)" 
                        radius={[8, 8, 0, 0]}
                        maxBarSize={60}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}