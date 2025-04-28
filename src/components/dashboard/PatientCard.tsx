import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User } from 'lucide-react';
import { Patient, PatientMetrics } from '@/utils/mockData';
import { formatLastSession, formatPercentile, getScoreColorClass } from '@/utils/dataProcessing';

interface PatientCardProps {
  patient: Patient;
  metrics: PatientMetrics;
  onClick: (id: string) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  metrics,
  onClick
}) => {
  return (
    <Card 
      className="glass cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
      onClick={() => onClick(patient.id)} // Navigate to patient details
    >
      <div className="h-2 bg-gradient-to-r from-primary/80 to-primary"></div>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{patient.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <User className="mr-1 h-3.5 w-3.5" />
              <span>
                {patient.age} y/o {patient.gender.charAt(0)}
              </span>
            </div>
          </div>
          <Badge variant={getScoreBadgeVariant(metrics.percentile)}>
            {formatPercentile(metrics.percentile)} Percentile
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">ADHD Subtype</span>
            <span className="font-medium">{patient.adhdSubtype}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="font-medium">+{metrics.progress}% Last 30d</span>
          </div>
          <div className="flex items-center text-sm">
            <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">
              Last session: {formatLastSession(patient.lastAssessment)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">
              {patient.assessmentCount} sessions
            </span>
          </div>
        </div>
        
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Cognitive Score</span>
            <span className={`text-xs font-medium ${getScoreColorClass(metrics.percentile)}`}>
              {metrics.percentile}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${metrics.percentile}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to determine badge variant based on percentile
const getScoreBadgeVariant = (score: number): "default" | "destructive" | "outline" | "secondary" => {
  if (score < 40) return "destructive";
  if (score < 60) return "outline";
  if (score < 85) return "secondary";
  return "default";
};
