
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  description?: string;
}

export const MetricCard = ({ title, value, change, changeLabel, icon, description }: MetricCardProps) => {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return 'text-gray-600';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        {icon && <div className="text-slate-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {description && <p className="text-xs text-slate-400 mb-2">{description}</p>}
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>
              {change > 0 ? '+' : ''}{change.toFixed(1)}% {changeLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
