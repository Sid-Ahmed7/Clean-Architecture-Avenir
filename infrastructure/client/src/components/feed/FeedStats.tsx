import { News } from "@/types/news";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface FeedStatsProps {
    topFeeds: News[];
}

export function FeedStats({topFeeds} : FeedStatsProps) {
    const data = [...topFeeds]
        .sort((a,b) => b.views - a.views)
        .slice(0, 5)
        .map((n) => ({name: n.title, Views: n.views}));
 return (
    <div className="border rounded p-4 shadow mb-4">
      <h3 className="text-lg font-bold mb-2">Top 5 feeds les plus vues</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};