
export interface User {
  handle_id: string;
  company_name: string;
  ip_address: string;
  registered_at: string;
}

export interface Sentiment {
  id: number;
  handle_id: string;
  sentiment: 'GREAT' | 'MEH' | 'UGH';
  timestamp: string;
}

export interface SentimentAnalytics {
  totalSubmissions: number;
  averageScore: number;
  sentimentDistribution: {
    GREAT: number;
    MEH: number;
    UGH: number;
  };
  trendData: Array<{
    timestamp: string;
    GREAT: number;
    MEH: number;
    UGH: number;
    score: number;
  }>;
  timeOfDayAnalysis: Array<{
    hour: number;
    averageScore: number;
    submissions: number;
  }>;
  dayOfWeekAnalysis: Array<{
    day: string;
    averageScore: number;
    submissions: number;
  }>;
}

export type TimeRange = 'hour' | 'day' | 'week' | 'month' | 'quarter';
