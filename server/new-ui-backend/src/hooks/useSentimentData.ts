import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sentiment, User, SentimentAnalytics, TimeRange } from '@/types/sentiment';

export const useSentimentData = (timeRange: TimeRange) => {
  const [analytics, setAnalytics] = useState<SentimentAnalytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sentiments, setSentiments] = useState<Sentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTimeRangeFilter = (range: TimeRange) => {
    const now = new Date();
    switch (range) {
      case 'hour':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case 'quarter':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const calculateSentimentScore = (sentiment: string) => {
    switch (sentiment) {
      case 'GREAT': return 3;
      case 'MEH': return 2;
      case 'UGH': return 1;
      default: return 2;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('registered_at', { ascending: false });

        if (usersError) throw usersError;

        // Fetch sentiments for the time range
        const timeFilter = getTimeRangeFilter(timeRange);
        const { data: sentimentsData, error: sentimentsError } = await supabase
          .from('sentiments')
          .select('*')
          .gte('timestamp', timeFilter)
          .order('timestamp', { ascending: true });

        if (sentimentsError) throw sentimentsError;

        setUsers(usersData || []);
        
        // Type assertion to ensure proper typing
        const typedSentiments = (sentimentsData || []).map(s => ({
          ...s,
          sentiment: s.sentiment as 'GREAT' | 'MEH' | 'UGH'
        }));
        setSentiments(typedSentiments);

        // Calculate analytics
        const analytics = calculateAnalytics(typedSentiments);
        setAnalytics(analytics);

      } catch (err) {
        console.error('Error fetching sentiment data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const calculateAnalytics = (sentiments: Sentiment[]): SentimentAnalytics => {
    const totalSubmissions = sentiments.length;
    
    // Sentiment distribution
    const distribution = sentiments.reduce((acc, s) => {
      acc[s.sentiment] = (acc[s.sentiment] || 0) + 1;
      return acc;
    }, { GREAT: 0, MEH: 0, UGH: 0 });

    // Average score
    const totalScore = sentiments.reduce((acc, s) => acc + calculateSentimentScore(s.sentiment), 0);
    const averageScore = totalSubmissions > 0 ? totalScore / totalSubmissions : 0;

    // Trend data (grouped by hour/day depending on time range)
    const trendData = groupSentimentsByTime(sentiments, timeRange);

    // Time of day analysis
    const timeOfDayAnalysis = analyzeTimeOfDay(sentiments);

    // Day of week analysis
    const dayOfWeekAnalysis = analyzeDayOfWeek(sentiments);

    return {
      totalSubmissions,
      averageScore,
      sentimentDistribution: distribution,
      trendData,
      timeOfDayAnalysis,
      dayOfWeekAnalysis
    };
  };

  const groupSentimentsByTime = (sentiments: Sentiment[], range: TimeRange) => {
    const groups: { [key: string]: { GREAT: number; MEH: number; UGH: number; total: number } } = {};
    
    sentiments.forEach(sentiment => {
      const date = new Date(sentiment.timestamp);
      let key: string;
      
      if (range === 'hour') {
        key = date.toISOString().slice(0, 13); // YYYY-MM-DDTHH
      } else {
        key = date.toISOString().slice(0, 10); // YYYY-MM-DD
      }
      
      if (!groups[key]) {
        groups[key] = { GREAT: 0, MEH: 0, UGH: 0, total: 0 };
      }
      
      groups[key][sentiment.sentiment]++;
      groups[key].total++;
    });

    return Object.entries(groups).map(([timestamp, data]) => ({
      timestamp,
      GREAT: data.GREAT,
      MEH: data.MEH,
      UGH: data.UGH,
      score: (data.GREAT * 3 + data.MEH * 2 + data.UGH * 1) / data.total || 0
    }));
  };

  const analyzeTimeOfDay = (sentiments: Sentiment[]) => {
    const hourlyData: { [hour: number]: { scores: number[]; count: number } } = {};
    
    sentiments.forEach(sentiment => {
      const hour = new Date(sentiment.timestamp).getHours();
      const score = calculateSentimentScore(sentiment.sentiment);
      
      if (!hourlyData[hour]) {
        hourlyData[hour] = { scores: [], count: 0 };
      }
      
      hourlyData[hour].scores.push(score);
      hourlyData[hour].count++;
    });

    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      averageScore: hourlyData[hour] 
        ? hourlyData[hour].scores.reduce((a, b) => a + b, 0) / hourlyData[hour].scores.length 
        : 0,
      submissions: hourlyData[hour]?.count || 0
    }));
  };

  const analyzeDayOfWeek = (sentiments: Sentiment[]) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyData: { [day: number]: { scores: number[]; count: number } } = {};
    
    sentiments.forEach(sentiment => {
      const day = new Date(sentiment.timestamp).getDay();
      const score = calculateSentimentScore(sentiment.sentiment);
      
      if (!dailyData[day]) {
        dailyData[day] = { scores: [], count: 0 };
      }
      
      dailyData[day].scores.push(score);
      dailyData[day].count++;
    });

    return days.map((dayName, index) => ({
      day: dayName,
      averageScore: dailyData[index] 
        ? dailyData[index].scores.reduce((a, b) => a + b, 0) / dailyData[index].scores.length 
        : 0,
      submissions: dailyData[index]?.count || 0
    }));
  };

  return { analytics, users, sentiments, loading, error };
};
