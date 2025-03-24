
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Activity } from '@/types/databaseTypes';
import { SessionData } from '@/utils/types/patientTypes';
import { formatDuration } from '@/utils/dataProcessing';

// Component Props
interface ActivityBreakdownProps {
  session: SessionData | null;
  isLoading?: boolean;
}

export const ActivityBreakdown: React.FC<ActivityBreakdownProps> = ({ session, isLoading = false }) => {
  // If loading or session is null, show loading state
  if (isLoading || !session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            {isLoading ? "Loading activity data..." : "No session selected"}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Process activities for the chart
  const chartData = session.activities?.map(activity => ({
    name: activity.type.length > 15 ? activity.type.substring(0, 15) + '...' : activity.type,
    score: activity.score,
    duration: Math.round(activity.duration / 60), // Convert seconds to minutes
    difficulty: activity.difficulty
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 mb-6">
          <div className="text-sm text-muted-foreground">Activity Breakdown</div>
          <div className="text-2xl font-bold">
            {session.activities?.length || 0} activities
          </div>
          <div className="text-sm text-muted-foreground">
            Total duration: {formatDuration(session.duration * 60)}
          </div>
        </div>

        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'duration') return [`${value} min`, 'Duration'];
                    if (name === 'score') return [`${value}%`, 'Score'];
                    if (name === 'difficulty') return [`${value}/5`, 'Difficulty'];
                    return [value, name];
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="score" 
                  name="Score" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="difficulty" 
                  name="Difficulty" 
                  fill="hsl(var(--warning))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No activity data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
