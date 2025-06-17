
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimeAnalysisChartProps {
  data: Array<{
    hour?: number;
    day?: string;
    averageScore: number;
    submissions: number;
  }>;
  type: 'hourly' | 'daily';
}

export const TimeAnalysisChart = ({ data, type }: TimeAnalysisChartProps) => {
  const getBarColor = (score: number) => {
    if (score >= 2.5) return '#10B981'; // Green for high scores
    if (score >= 2) return '#F59E0B';   // Yellow for medium scores
    return '#EF4444';                   // Red for low scores
  };

  const formatXAxisLabel = (tickItem: any) => {
    if (type === 'hourly') {
      const hour = parseInt(tickItem);
      return hour === 0 ? '12 AM' : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
    }
    return tickItem.slice(0, 3); // First 3 letters of day name
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">
            {type === 'hourly' ? `${formatXAxisLabel(label)}` : data.day}
          </p>
          <p className="text-blue-400">
            Avg Score: {data.averageScore.toFixed(2)} / 3.0
          </p>
          <p className="text-gray-300">
            Submissions: {data.submissions}
          </p>
          <p className="text-purple-400">
            Score %: {((data.averageScore / 3) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">
          {type === 'hourly' ? 'Sentiment by Time of Day' : 'Sentiment by Day of Week'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey={type === 'hourly' ? 'hour' : 'day'}
              tickFormatter={formatXAxisLabel}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              domain={[0, 3]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="averageScore" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.averageScore)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
