
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { SessionData } from '@/utils/types/patientTypes';
import { getScoreColorClass } from '@/utils/dataProcessing';
import { SessionAnalysis } from '@/components/sessions/SessionAnalysis';
import { ActivityBreakdown } from '@/components/sessions/ActivityBreakdown';

interface PatientSessionsProps {
  sessions: SessionData[];
  selectedSessionIndex: number;
  onSessionSelect: (index: number) => void;
}

export const PatientSessions: React.FC<PatientSessionsProps> = ({
  sessions,
  selectedSessionIndex,
  onSessionSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <Card className="glass md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Session History</h3>
          
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">No sessions available</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((session, index) => (
                <div 
                  key={session.id}
                  onClick={() => onSessionSelect(index)}
                  className={`p-3 border border-border rounded-md cursor-pointer transition-colors
                    ${selectedSessionIndex === index ? 'bg-primary/10 border-primary/50' : 'hover:bg-muted/30'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">
                      {format(parseISO(session.startTime), 'MMM d, yyyy')}
                    </span>
                    <Badge 
                      variant={session.completionStatus === 'Completed' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {session.completionStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {format(parseISO(session.startTime), 'h:mm a')}
                      </span>
                    </div>
                    <span className={getScoreColorClass(session.overallScore)}>
                      {Math.round(session.overallScore)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="glass md:col-span-3 space-y-6">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No session data available</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <SessionAnalysis session={sessions[selectedSessionIndex]} />
            <ActivityBreakdown session={sessions[selectedSessionIndex]} />
          </>
        )}
      </div>
    </div>
  );
};
