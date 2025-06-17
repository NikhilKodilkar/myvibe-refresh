
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Sentiment } from '@/types/sentiment';

interface UsersTableProps {
  users: User[];
  sentiments: Sentiment[];
}

export const UsersTable = ({ users, sentiments }: UsersTableProps) => {
  const getUserLatestSentiment = (handleId: string) => {
    const userSentiments = sentiments
      .filter(s => s.handle_id === handleId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return userSentiments[0];
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'GREAT': return 'bg-green-500 hover:bg-green-600';
      case 'MEH': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'UGH': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getUserSentimentCount = (handleId: string) => {
    return sentiments.filter(s => s.handle_id === handleId).length;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-2 text-slate-300 font-medium">Handle</th>
                <th className="text-left py-3 px-2 text-slate-300 font-medium">Company</th>
                <th className="text-left py-3 px-2 text-slate-300 font-medium">Latest Vibe</th>
                <th className="text-left py-3 px-2 text-slate-300 font-medium">Last Updated</th>
                <th className="text-left py-3 px-2 text-slate-300 font-medium">Total Submissions</th>
                <th className="text-left py-3 px-2 text-slate-300 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const latestSentiment = getUserLatestSentiment(user.handle_id);
                const totalSubmissions = getUserSentimentCount(user.handle_id);
                
                return (
                  <tr key={user.handle_id} className="border-b border-slate-700 hover:bg-slate-800/50">
                    <td className="py-3 px-2">
                      <span className="text-white font-mono">{user.handle_id}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-slate-300">{user.company_name}</span>
                    </td>
                    <td className="py-3 px-2">
                      {latestSentiment ? (
                        <Badge className={`text-white ${getSentimentBadgeColor(latestSentiment.sentiment)}`}>
                          {latestSentiment.sentiment}
                        </Badge>
                      ) : (
                        <span className="text-slate-500">No data</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {latestSentiment ? (
                        <span className="text-slate-400">
                          {new Date(latestSentiment.timestamp).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white font-bold">{totalSubmissions}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-slate-400">
                        {new Date(user.registered_at).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
