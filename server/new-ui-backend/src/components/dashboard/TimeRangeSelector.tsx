
import { Button } from '@/components/ui/button';
import { TimeRange } from '@/types/sentiment';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export const TimeRangeSelector = ({ selectedRange, onRangeChange }: TimeRangeSelectorProps) => {
  const ranges: { value: TimeRange; label: string }[] = [
    { value: 'hour', label: 'Last Hour' },
    { value: 'day', label: 'Last Day' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selectedRange === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onRangeChange(range.value)}
          className={
            selectedRange === range.value
              ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
              : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white"
          }
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};
