
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { TrendData } from '@/services/patient';

interface ImpulseTabProps {
  session: TrendData;
  getScoreColor: (score: number) => string;
  formatScore: (score: number) => number;
  formatPercentile: (percentile: number) => string;
  getClassificationStyle: (classification: string) => string;
}

export const ImpulseTab: React.FC<ImpulseTabProps> = ({
  session,
  getScoreColor,
  formatScore,
  formatPercentile,
  getClassificationStyle
}) => {
  if (!session.impulse_details) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No detailed impulse control data available for this session</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Overall Score</div>
          <div className={`text-xl font-bold ${getScoreColor(session.impulse_details.overall_score)}`}>
            {formatScore(session.impulse_details.overall_score)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Percentile</div>
          <div className="text-xl font-bold">
            {formatPercentile(session.impulse_details.percentile)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Classification</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(session.impulse_details.classification)}`}>
            {session.impulse_details.classification}
          </span>
        </div>
      </div>
      
      <div>
        <div className="font-medium mb-3 text-sm">Components</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(session.impulse_details.components || {}).map(([key, value]) => (
            <div key={key} className="border rounded-md p-3 bg-background shadow-sm">
              <div className="flex justify-between">
                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                <span className={`font-bold ${getScoreColor(typeof value === 'number' ? value : 0)}`}>
                  {typeof value === 'number' ? formatScore(value) : String(value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium mb-2">Games Used</div>
          <div className="flex flex-wrap gap-2">
            {session.impulse_details.games_used?.map((game, i) => (
              <span key={i} className="bg-primary/10 px-2 py-1 rounded-full text-xs font-medium text-primary">
                {game}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Data Completeness</div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${session.impulse_details.data_completeness}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {session.impulse_details.data_completeness}% complete
          </div>
        </div>
      </div>
    </div>
  );
}
