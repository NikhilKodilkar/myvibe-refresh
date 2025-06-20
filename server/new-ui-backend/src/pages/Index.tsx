import { useState } from 'react';
import { useSentimentData } from '@/hooks/useSentimentData';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { SentimentDistribution } from '@/components/dashboard/SentimentDistribution';
import { TimeAnalysisChart } from '@/components/dashboard/TimeAnalysisChart';
import { UsersTable } from '@/components/dashboard/UsersTable';
import { TimeRangeSelector } from '@/components/dashboard/TimeRangeSelector';
import { ExecutiveInsights } from '@/components/dashboard/ExecutiveInsights';
import { TimeRange } from '@/types/sentiment';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

const Index = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const { analytics, users, sentiments, loading, error } = useSentimentData(timeRange);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading sentiment analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Error loading data: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 text-lg">No data available</p>
        </div>
      </div>
    );
  }

  const sentimentScore = (analytics.averageScore / 3) * 100;
  const activeUsers = new Set(sentiments.map(s => s.handle_id)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Vibe Check Analytics
                <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                  SQLite Version
                </span>
              </h1>
              <p className="text-slate-400">
                Real-time sentiment insights and organizational pulse monitoring
              </p>
            </div>
            <TimeRangeSelector 
              selectedRange={timeRange} 
              onRangeChange={setTimeRange}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Executive Insights Section */}
        <div className="mb-8">
          <ExecutiveInsights 
            analytics={analytics} 
            sentiments={sentiments} 
            timeRange={timeRange} 
          />
        </div>

        {/* Charts Row 1 - Sentiment Trends & Distribution */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <SentimentChart data={analytics.trendData} timeRange={timeRange} />
          </div>
          <div>
            <SentimentDistribution data={analytics.sentimentDistribution} />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Overall Sentiment Score"
            value={`${sentimentScore.toFixed(1)}%`}
            change={12.5}
            changeLabel="vs previous period"
            icon={<TrendingUp className="h-5 w-5" />}
            description={`${analytics.averageScore.toFixed(2)} / 3.0`}
          />
          <MetricCard
            title="Total Submissions"
            value={analytics.totalSubmissions.toLocaleString()}
            change={8.2}
            changeLabel="vs previous period"
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <MetricCard
            title="Active Users"
            value={activeUsers}
            change={-2.1}
            changeLabel="vs previous period"
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Participation Rate"
            value={`${((activeUsers / users.length) * 100).toFixed(1)}%`}
            change={5.7}
            changeLabel="vs previous period"
            icon={<Activity className="h-5 w-5" />}
            description={`${activeUsers} of ${users.length} users`}
          />
        </div>

        {/* Charts Row 2 - Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TimeAnalysisChart 
            data={analytics.timeOfDayAnalysis} 
            type="hourly"
          />
          <TimeAnalysisChart 
            data={analytics.dayOfWeekAnalysis} 
            type="daily"
          />
        </div>

        {/* Users Table */}
        <UsersTable users={users} sentiments={sentiments} />
      </div>
    </div>
  );
};

export default Index;
