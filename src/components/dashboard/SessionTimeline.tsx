
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Session } from '@/types/databaseTypes';
import { formatDuration, processSessionsForTimeline } from '@/utils/dataProcessing';
import { supabase } from '@/integrations/supabase/client';

interface SessionTimelineProps {
  patientId?: string;
  sessions?: Session[];
  title?: string;
}

export const SessionTimeline: React.FC<SessionTimelineProps> = ({ 
  patientId,
  sessions: propSessions, 
  title = 'Session Progress' 
}) => {
  const [sessions, setSessions] = useState<Session[]>(propSessions || []);
  const [isLoading, setIsLoading] = useState(!propSessions && !!patientId);
  
  // Fetch sessions from database if not provided as props
  useEffect(() => {
    const fetchSessions = async () => {
      if (!patientId || propSessions) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('patient_id', patientId)
          .order('start_time', { ascending: false });
        
        if (error) {
          console.error('Error fetching sessions:', error);
          return;
        }
        
        setSessions(data || []);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessions();
  }, [patientId, propSessions]);
  
  // Process data for the chart with defensive programming
  const timelineData = processSessionsForTimeline(sessions);
  
  // Calculate sessions statistics with null checks
  const totalSessions = sessions?.length || 0;
  const totalDuration = sessions?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
  const averageScore = Math.round(
    sessions?.reduce((sum, session) => sum + (session.overall_score || 0), 0) / (sessions?.length || 1)
  ) || 0;
  
  if (isLoading) {
    return (
      <Card className="glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Loading session data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Sessions</span>
            <span className="text-xl font-semibold">{totalSessions}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Duration</span>
            <span className="text-xl font-semibold">{formatDuration(totalDuration)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Average Score</span>
            <span className="text-xl font-semibold">{averageScore}%</span>
          </div>
        </div>
        
        <div className="h-[250px] w-full">
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timelineData}
                margin={{ top: 20, right: 5, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(date) => {
                    if (!date || typeof date !== 'string') return '';
                    const parts = date.split('-');
                    if (parts.length < 3) return date;
                    return `${parts[1]}/${parts[2]}`;
                  }}
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
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                  dot={{ r: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No session data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
