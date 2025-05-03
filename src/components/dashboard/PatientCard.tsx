
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Clock, User } from 'lucide-react';
import { formatLastSession, getScoreColorClass } from '@/utils/dataProcessing';

interface PatientCardProps {
  patient: {
    user_id: string;
    name: string;
    age?: number;
    gender?: string;
    adhd_subtype?: string;
    last_session_date?: string;
    total_sessions?: number;
  };
  metrics: {
    percentile?: number;
    attention?: number;
    memory?: number;
    executive_function?: number;
    impulse_control?: number;
    progress?: number;
  };
  onClick: (id: string) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  metrics,
  onClick
}) => {
  // Format percentile with ordinal suffix
  const formatPercentile = (value: number = 0): string => {
    if (value > 10 && value < 20) return `${value}th`;
    const lastDigit = value % 10;
    switch (lastDigit) {
      case 1: return `${value}st`;
      case 2: return `${value}nd`;
      case 3: return `${value}rd`;
      default: return `${value}th`;
    }
  };

  // Determine badge variant based on percentile
  const getScoreBadgeVariant = (score: number = 0): "default" | "destructive" | "outline" | "secondary" => {
    if (score < 40) return "destructive";
    if (score < 60) return "outline";
    if (score < 85) return "secondary";
    return "default";
  };

  const percentile = metrics?.percentile || 0;
  const progress = metrics?.progress || 0;

  return (
    <Card 
      className="glass cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
      onClick={() => onClick(patient.user_id)}
    >
      <div className="h-1.5 sm:h-2 bg-gradient-to-r from-primary/80 to-primary"></div>
      <CardContent className="p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-2">
          <div>
            <h3 className="font-semibold text-sm sm:text-lg line-clamp-1">{patient.name}</h3>
            <div className="flex items-center text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">
              <User className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>
                {patient.age ? `${patient.age} y/o ` : ''}
                {patient.gender ? patient.gender.charAt(0) : ''}
              </span>
            </div>
          </div>
          <Badge variant={getScoreBadgeVariant(percentile)} className="text-xs sm:text-sm whitespace-nowrap">
            {formatPercentile(percentile)} Percentile
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-5">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">ADHD Subtype</span>
            <span className="font-medium text-xs sm:text-sm">{patient.adhd_subtype || 'Not Specified'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="font-medium text-xs sm:text-sm">+{progress}% Last 30d</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
            <span className="text-xs">
              Last session: {formatLastSession(patient.last_session_date)}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
            <span className="text-xs">
              {patient.total_sessions || 0} sessions
            </span>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-5">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-xs text-muted-foreground">Cognitive Score</span>
            <span className={`text-xs font-medium ${getScoreColorClass(percentile)}`}>
              {percentile}%
            </span>
          </div>
          <Progress value={percentile} className="h-1 sm:h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
};
