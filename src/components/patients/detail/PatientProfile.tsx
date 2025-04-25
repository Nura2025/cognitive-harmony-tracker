import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, ArrowUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { DomainChart } from '@/components/dashboard/DomainChart';
import { Patient, PatientMetrics } from '@/utils/types/patientTypes';
import { formatPercentile, getScoreColorClass } from '@/utils/dataProcessing';
import { Separator } from '@/components/ui/separator';

interface PatientProfileProps {
  patient: Patient;
  metrics: PatientMetrics;
  domainTrendData: {
    attention: number[];
    memory: number[];
    executiveFunction: number[];
    behavioral: number[];
  };
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  metrics,
  domainTrendData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glass md:col-span-1">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-background border-2 border-card flex items-center justify-center">
                <span className="text-xs font-medium">{patient.age}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Age</h3>
              <p className="font-medium">{patient.age} years</p>
            </div>
            
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Gender</h3>
              <p className="font-medium">{patient.gender}</p>
            </div>
            
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">ADHD Subtype</h3>
              <Badge variant="outline" className="font-normal">
                {patient.adhdSubtype}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Total Sessions</h3>
              <p className="font-medium">{patient.assessmentCount}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-base font-medium mb-3">Cognitive Performance</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Attention</span>
                    <span className="text-sm font-medium">{metrics.attention}%</span>
                  </div>
                  <Progress value={metrics.attention} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Memory</span>
                    <span className="text-sm font-medium">{metrics.memory}%</span>
                  </div>
                  <Progress value={metrics.memory} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Executive Function</span>
                    <span className="text-sm font-medium">{metrics.executiveFunction}%</span>
                  </div>
                  <Progress value={metrics.executiveFunction} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Behavioral</span>
                    <span className="text-sm font-medium">{metrics.behavioral}%</span>
                  </div>
                  <Progress value={metrics.behavioral} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <h4 className="text-sm font-medium">First session</h4>
              </div>
              <p className="text-lg font-medium">
                {patient.lastAssessment}
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <h4 className="text-sm font-medium">Last session</h4>
              </div>
              <p className="text-lg font-medium">
                {patient.lastAssessment}
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ArrowUp className="h-4 w-4 mr-2 text-emerald-500" />
                <h4 className="text-sm font-medium">Overall improvement</h4>
              </div>
              <p className="text-lg font-medium text-emerald-500">+{metrics.progress}%</p>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-4">Progress Overview</h3>
          
          <div className="p-4 bg-muted/30 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-medium">Cognitive Percentile</h4>
                <p className="text-sm text-muted-foreground">
                  Compared to age-matched peers
                </p>
              </div>
              <div className="flex items-center">
                <span className={`text-2xl font-bold ${getScoreColorClass(metrics.percentile)}`}>
                  {formatPercentile(metrics.percentile)}
                </span>
              </div>
            </div>
            
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full bg-primary`}
                style={{ width: `${metrics.percentile}%` }}
              />
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Cognitive Domain Trends</h3>
            <DomainChart domainData={domainTrendData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
