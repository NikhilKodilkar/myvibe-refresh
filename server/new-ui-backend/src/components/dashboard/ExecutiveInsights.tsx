
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, TrendingDown, Clock, Calendar, Target, Zap } from 'lucide-react';
import { SentimentAnalytics, Sentiment } from '@/types/sentiment';

interface ExecutiveInsightsProps {
  analytics: SentimentAnalytics;
  sentiments: Sentiment[];
  timeRange: string;
}

export const ExecutiveInsights = ({ analytics, sentiments, timeRange }: ExecutiveInsightsProps) => {
  // Calculate key insights
  const calculateInsights = () => {
    const { averageScore, sentimentDistribution, trendData, timeOfDayAnalysis, dayOfWeekAnalysis } = analytics;
    
    // Risk Assessment
    const riskLevel = averageScore < 2 ? 'HIGH' : averageScore < 2.5 ? 'MEDIUM' : 'LOW';
    const riskColor = riskLevel === 'HIGH' ? 'text-red-500' : riskLevel === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500';
    
    // Volatility Index (standard deviation of scores)
    const scores = trendData.map(d => d.score);
    const avgTrendScore = scores.reduce((a, b) => a + b, 0) / scores.length || 0;
    const volatility = Math.sqrt(scores.reduce((acc, score) => acc + Math.pow(score - avgTrendScore, 2), 0) / scores.length);
    const volatilityLevel = volatility > 0.5 ? 'HIGH' : volatility > 0.3 ? 'MEDIUM' : 'LOW';
    
    // Engagement Analysis
    const mehPercentage = (sentimentDistribution.MEH / analytics.totalSubmissions) * 100;
    const engagementConcern = mehPercentage > 60 ? 'Disengagement Risk' : mehPercentage > 40 ? 'Monitor Closely' : 'Healthy';
    
    // Peak Performance Time
    const bestHour = timeOfDayAnalysis.reduce((best, current) => 
      current.averageScore > best.averageScore ? current : best
    );
    const bestDay = dayOfWeekAnalysis.reduce((best, current) => 
      current.averageScore > best.averageScore ? current : best
    );
    
    // Trajectory Analysis
    const recentTrend = trendData.length >= 2 
      ? trendData[trendData.length - 1].score - trendData[trendData.length - 2].score
      : 0;
    const trendDirection = recentTrend > 0.1 ? 'IMPROVING' : recentTrend < -0.1 ? 'DECLINING' : 'STABLE';
    
    // Participation Rate (based on unique users submitting)
    const activeUsers = new Set(sentiments.map(s => s.handle_id)).size;
    const participationRate = (activeUsers / 10) * 100; // Assuming 10 total users for now
    
    return {
      riskLevel,
      riskColor,
      volatilityLevel,
      engagementConcern,
      bestHour,
      bestDay,
      trendDirection,
      participationRate,
      mehPercentage
    };
  };

  const insights = calculateInsights();

  const InsightCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    color = "text-white",
    trend 
  }: {
    title: string;
    value: string;
    description: string;
    icon: any;
    color?: string;
    trend?: 'up' | 'down' | 'stable';
  }) => (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className={`h-5 w-5 ${color}`} />
          {trend && (
            <div className="flex items-center">
              {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
              {trend === 'stable' && <div className="h-4 w-4 rounded-full bg-yellow-500" />}
            </div>
          )}
        </div>
        <div className={`text-xl font-bold ${color} mb-1`}>{value}</div>
        <div className="text-xs text-slate-400">{title}</div>
        <div className="text-xs text-slate-500 mt-1">{description}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Executive Insights</h2>
        <div className="text-sm text-slate-400">Strategic sentiment intelligence</div>
      </div>

      {/* Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          title="Organizational Risk"
          value={insights.riskLevel}
          description={`Avg sentiment: ${analytics.averageScore.toFixed(2)}/3.0`}
          icon={AlertTriangle}
          color={insights.riskColor}
          trend={insights.trendDirection === 'IMPROVING' ? 'up' : insights.trendDirection === 'DECLINING' ? 'down' : 'stable'}
        />
        
        <InsightCard
          title="Sentiment Volatility"
          value={insights.volatilityLevel}
          description="Organizational stability index"
          icon={Zap}
          color={insights.volatilityLevel === 'HIGH' ? 'text-red-500' : insights.volatilityLevel === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'}
        />
        
        <InsightCard
          title="Engagement Health"
          value={insights.engagementConcern}
          description={`${insights.mehPercentage.toFixed(1)}% neutral responses`}
          icon={Target}
          color={insights.engagementConcern === 'Disengagement Risk' ? 'text-red-500' : insights.engagementConcern === 'Monitor Closely' ? 'text-yellow-500' : 'text-green-500'}
        />
        
        <InsightCard
          title="Participation Rate"
          value={`${insights.participationRate.toFixed(0)}%`}
          description="Team engagement level"
          icon={TrendingUp}
          color={insights.participationRate > 80 ? 'text-green-500' : insights.participationRate > 60 ? 'text-yellow-500' : 'text-red-500'}
        />
      </div>

      {/* Strategic Recommendations */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            Peak Performance Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Optimal Communication Window</h4>
              <p className="text-lg font-bold text-green-400">
                {insights.bestHour.hour === 0 ? '12 AM' : 
                 insights.bestHour.hour <= 12 ? `${insights.bestHour.hour} AM` : 
                 `${insights.bestHour.hour - 12} PM`}
              </p>
              <p className="text-xs text-slate-500">
                Peak sentiment: {insights.bestHour.averageScore.toFixed(2)}/3.0
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Best Day for Major Announcements</h4>
              <p className="text-lg font-bold text-green-400">{insights.bestDay.day}</p>
              <p className="text-xs text-slate-500">
                Average sentiment: {insights.bestDay.averageScore.toFixed(2)}/3.0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actionable Insights */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.riskLevel === 'HIGH' && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400">Immediate Action Required</p>
                  <p className="text-xs text-slate-300">Low sentiment detected. Consider team check-ins or culture initiatives.</p>
                </div>
              </div>
            )}
            
            {insights.mehPercentage > 50 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Target className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-400">Engagement Opportunity</p>
                  <p className="text-xs text-slate-300">High neutral sentiment suggests untapped potential for improvement.</p>
                </div>
              </div>
            )}
            
            {insights.participationRate < 70 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-400">Increase Participation</p>
                  <p className="text-xs text-slate-300">Low participation rate may indicate communication gaps.</p>
                </div>
              </div>
            )}
            
            {insights.trendDirection === 'IMPROVING' && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-400">Positive Momentum</p>
                  <p className="text-xs text-slate-300">Sentiment is improving. Consider reinforcing current initiatives.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
