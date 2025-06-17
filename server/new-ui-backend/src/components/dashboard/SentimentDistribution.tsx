
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SentimentDistributionProps {
  data: {
    GREAT: number;
    MEH: number;
    UGH: number;
  };
}

export const SentimentDistribution = ({ data }: SentimentDistributionProps) => {
  const chartData = [
    { name: 'GREAT', value: data.GREAT, color: '#10B981' },
    { name: 'MEH', value: data.MEH, color: '#F59E0B' },
    { name: 'UGH', value: data.UGH, color: '#EF4444' }
  ];

  const total = data.GREAT + data.MEH + data.UGH;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-800 border border-slate-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p style={{ color: data.payload.color }}>
            Count: {data.value} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Sentiment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className="text-white text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {chartData.map((item) => (
            <div key={item.name} className="text-center">
              <div className="text-2xl font-bold" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-sm text-slate-400">{item.name}</div>
              <div className="text-xs text-slate-500">
                {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
