
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, CalendarClock, Clock, Laptop, MapPin } from 'lucide-react';
import { Session } from '@/types/databaseTypes';
import { formatDuration, getScoreBgClass, getScoreColorClass } from '@/utils/dataProcessing';
import { format, parseISO } from 'date-fns';

interface SessionAnalysisProps {
  session: Session;
}

export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({ session }) => {
  // Add null checks and default values for all session data
  let formattedDate = 'Unknown date';
  let formattedTime = 'Unknown time';
  
  try {
    if (session.start_time) {
      formattedDate = format(parseISO(session.start_time), 'MMMM d, yyyy');
      formattedTime = format(parseISO(session.start_time), 'h:mm a');
    }
  } catch (error) {
    console.error("Error formatting date:", error);
  }
  
  const scoreColorClass = getScoreColorClass(session.overall_score);
  const scoreBgClass = getScoreBgClass(session.overall_score || 0);
  
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Session Overview</CardTitle>
          <Badge 
            variant={session.completion_status === 'Completed' ? 'default' : 'outline'}
            className={session.completion_status !== 'Completed' ? 'text-amber-500' : ''}
          >
            {session.completion_status || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CalendarClock className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{formattedDate}</p>
                <p className="text-xs text-muted-foreground">{formattedTime}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{formatDuration(session.duration || 0)}</p>
                <p className="text-xs text-muted-foreground">Session Duration</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{session.environment || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">Environment</p>
              </div>
            </div>
            <div className="flex items-center">
              <Laptop className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{session.device || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">Device</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-5 rounded-lg border border-border mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Overall Performance</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Combined score across all activities
            </p>
          </div>
          <div className={`${scoreBgClass} px-3 py-1.5 rounded-full`}>
            <span className={`text-xl font-bold ${scoreColorClass}`}>
              {Math.round(session.overall_score || 0)}%
            </span>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Domain Breakdown</h3>
          <div className="space-y-4">
            {Object.entries({
              attention: session.attention || 0,
              memory: session.memory || 0,
              executiveFunction: session.executive_function || 0,
              behavioral: session.behavioral || 0
            }).map(([domainKey, score]) => {
              const formattedDomain = domainKey === "executiveFunction" 
                ? "Executive Function" 
                : domainKey.charAt(0).toUpperCase() + domainKey.slice(1);
              
              return (
                <div key={domainKey} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-cognitive-${domainKey}`} />
                    <span className="text-sm">{formattedDomain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-cognitive-${domainKey} rounded-full`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getScoreColorClass(score)}`}>
                      {Math.round(score)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
