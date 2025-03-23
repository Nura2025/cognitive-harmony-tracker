
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { SessionData } from '@/utils/mockData';
import { formatDuration, getScoreColorClass } from '@/utils/dataProcessing';

interface ActivityBreakdownProps {
  session: SessionData;
}

export const ActivityBreakdown: React.FC<ActivityBreakdownProps> = ({ session }) => {
  // Process activities data for the chart
  const activityData = session.activities.map(activity => ({
    name: activity.type,
    score: activity.score,
    duration: activity.duration,
    difficulty: activity.difficulty
  }));
  
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activity Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activityData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                stroke="hsl(var(--muted-foreground))"
                tickMargin={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: number) => [`${value}%`, 'Score']}
              />
              <Bar 
                dataKey="score" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          {session.activities.map(activity => (
            <div key={activity.id} className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{activity.type}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Difficulty: {activity.difficulty}/5
                  </Badge>
                  <span className={`font-medium ${getScoreColorClass(activity.score)}`}>
                    {Math.round(activity.score)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{formatDuration(activity.duration)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Activity Type</p>
                  <p className="font-medium">{getActivityCognitiveFocus(activity.type)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get cognitive focus for each activity type
const getActivityCognitiveFocus = (activityType: string): string => {
  switch (activityType) {
    case 'Attention Farming':
      return 'Sustained Attention';
    case 'Memory Sequence':
      return 'Working Memory';
    case 'Card Matching':
      return 'Visual Memory';
    case 'Response Inhibition':
      return 'Inhibitory Control';
    case 'Task Switching':
      return 'Cognitive Flexibility';
    default:
      return 'Multiple Domains';
  }
};
