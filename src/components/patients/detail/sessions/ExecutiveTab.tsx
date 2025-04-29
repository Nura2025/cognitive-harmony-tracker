
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { TrendData } from '@/services/patient';

interface ExecutiveTabProps {
  session: TrendData;
  getScoreColor: (score: number) => string;
  formatScore: (score: number) => number;
  formatPercentile: (percentile: number) => string;
  getClassificationStyle: (classification: string) => string;
}

export const ExecutiveTab: React.FC<ExecutiveTabProps> = ({
  session,
  getScoreColor,
  formatScore,
  formatPercentile,
  getClassificationStyle
}) => {
  if (!session.executive_details) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No detailed executive function data available for this session</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Overall Score</div>
          <div className={`text-xl font-bold ${getScoreColor(session.executive_details.overall_score)}`}>
            {formatScore(session.executive_details.overall_score)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Percentile</div>
          <div className="text-xl font-bold">
            {formatPercentile(session.executive_details.percentile)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Classification</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(session.executive_details.classification)}`}>
            {session.executive_details.classification}
          </span>
        </div>
      </div>
      
      <div>
        <div className="font-medium mb-3 text-sm">Domain Contributions</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(session.executive_details.components || {}).map(([key, value]) => (
            <div key={key} className="border rounded-md p-3 bg-background shadow-sm">
              <div className="flex justify-between">
                <span className="font-medium capitalize">{key.replace(/_contribution/g, '').replace(/_/g, ' ')}</span>
                <span className={`font-bold ${getScoreColor(typeof value === 'number' ? value : 0)}`}>
                  {typeof value === 'number' ? formatScore(value) : String(value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="text-sm font-medium mb-2">Profile Pattern</div>
        <div className="bg-muted/20 p-3 rounded-md">
          <p className="text-sm">{session.executive_details.profile_pattern}</p>
        </div>
      </div>
    </div>
  );
}
