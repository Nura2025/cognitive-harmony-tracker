
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, CalendarClock, Clock, Laptop, MapPin } from 'lucide-react';
import { SessionData } from '@/utils/mockData';
import { formatDuration, getScoreBgClass, getScoreColorClass } from '@/utils/dataProcessing';
import { format, parseISO } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface SessionAnalysisProps {
  session: SessionData;
}

export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({ session }) => {
  const formattedDate = format(parseISO(session.startTime), 'MMMM d, yyyy');
  const formattedTime = format(parseISO(session.startTime), 'h:mm a');
  const scoreColorClass = getScoreColorClass(session.overallScore);
  const scoreBgClass = getScoreBgClass(session.overallScore);
  
  // Tooltip helper component
  const InfoTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground opacity-70" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Session Overview</CardTitle>
          <InfoTooltip content={
            session.completionStatus === 'Completed' 
              ? "Session was completed successfully with all activities finished" 
              : "Session was started but not all activities were completed"
          }>
            <Badge 
              variant={session.completionStatus === 'Completed' ? 'default' : 'outline'}
              className={session.completionStatus !== 'Completed' ? 'text-amber-500' : ''}
            >
              {session.completionStatus}
            </Badge>
          </InfoTooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <InfoTooltip content="Date and time when the session was started">
              <div className="flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formattedDate}</p>
                  <p className="text-xs text-muted-foreground">{formattedTime}</p>
                </div>
              </div>
            </InfoTooltip>
            
            <InfoTooltip content="Total time spent in this session across all activities">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formatDuration(session.duration)}</p>
                  <p className="text-xs text-muted-foreground">Session Duration</p>
                </div>
              </div>
            </InfoTooltip>
            
            <InfoTooltip content="Physical setting where the session was conducted">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{session.environment}</p>
                  <p className="text-xs text-muted-foreground">Environment</p>
                </div>
              </div>
            </InfoTooltip>
            
            <InfoTooltip content="Hardware device used for the session">
              <div className="flex items-center">
                <Laptop className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{session.device}</p>
                  <p className="text-xs text-muted-foreground">Device</p>
                </div>
              </div>
            </InfoTooltip>
          </div>
        </div>
        
        <InfoTooltip content="Combined weighted score calculated from all activities completed in this session">
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
                {Math.round(session.overallScore)}%
              </span>
            </div>
          </div>
        </InfoTooltip>
        
        <div>
          <InfoTooltip content="Performance breakdown by cognitive domain, showing strengths and areas for development">
            <h3 className="font-medium mb-3">Domain Breakdown</h3>
          </InfoTooltip>
          <div className="space-y-4">
            {(Object.keys(session.domainScores) as (keyof typeof session.domainScores)[]).map(domain => {
              const score = session.domainScores[domain];
              
              // Domain specific explanations
              const getDomainExplanation = () => {
                switch(domain) {
                  case 'attention':
                    return "Ability to focus on relevant tasks and ignore distractions";
                  case 'memory':
                    return "Capacity to encode, store, and retrieve information";
                  case 'executiveFunction':
                    return "Higher-order processes like planning, decision-making, and cognitive flexibility";
                  case 'behavioral':
                    return "Impulse control and emotional regulation abilities";
                  default:
                    return "Performance in this cognitive domain";
                }
              };
              
              return (
                <InfoTooltip key={domain} content={getDomainExplanation()}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-cognitive-${domain}`} />
                      <span className="text-sm">
                        {domain === 'executiveFunction' ? 'Executive Function' : domain.charAt(0).toUpperCase() + domain.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-cognitive-${domain} rounded-full`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getScoreColorClass(score)}`}>
                        {Math.round(score)}%
                      </span>
                    </div>
                  </div>
                </InfoTooltip>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
