
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SentimentChartProps {
  data: Array<{
    timestamp: string;
    GREAT: number;
    MEH: number;
    UGH: number;
    score: number;
  }>;
  timeRange: string;
}

export const SentimentChart = ({ data, timeRange }: SentimentChartProps) => {
  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeRange === 'hour') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = timeRange === 'hour' 
        ? date.toLocaleString()
        : date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      return (
        <div className="bg-slate-800 border border-slate-600 p-4 rounded-lg shadow-lg">
          <p className="text-slate-300 mb-2">{formattedDate}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.name === 'Score' && ` (${(entry.value * 100 / 3).toFixed(1)}%)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Sentiment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxisLabel}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="GREAT" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="MEH" 
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="UGH" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
              name="Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
