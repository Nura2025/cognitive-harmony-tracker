
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartBar, AlertCircle } from 'lucide-react';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { TrendData } from '@/services/patient';

interface PatientAnalysisProps {
  trendGraph: TrendData[];
  hasTrendData: boolean;
}

export const PatientAnalysis: React.FC<PatientAnalysisProps> = ({ trendGraph, hasTrendData }) => {
  // Prepare data for PerformanceTrend component
  const prepareTrendData = (trendGraph: TrendData[] = []) => {
    return {
      attention: trendGraph.map(session => ({
        date: session.session_date,
        score: session.attention_score,
      })),
      memory: trendGraph.map(session => ({
        date: session.session_date,
        score: session.memory_score,
      })),
      impulse: trendGraph.map(session => ({
        date: session.session_date,
        score: session.impulse_score,
      })),
      executive: trendGraph.map(session => ({
        date: session.session_date,
        score: session.executive_score,
      })),
    };
  };

  const trendData = prepareTrendData(trendGraph);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {hasTrendData && Object.keys(trendData).map((key, index) => (
        <PerformanceTrend 
          key={key}
          title={`${key.charAt(0).toUpperCase() + key.slice(1)} Performance`}
          data={trendData[key as keyof typeof trendData]}
          description={`Trend of ${key} scores over time`}
        />
      ))}
      
      {!hasTrendData && (
        <Card className="glass md:col-span-2">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
            <ChartBar className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No Analysis Data Available</h3>
            <p className="text-muted-foreground text-center">
              Detailed analysis will be available after the patient completes cognitive assessments.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
