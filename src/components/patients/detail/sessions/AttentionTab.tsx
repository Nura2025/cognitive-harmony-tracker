
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { TrendData } from '@/services/patient';

interface AttentionTabProps {
  session: TrendData;
  getScoreColor: (score: number) => string;
  formatScore: (score: number) => number;
  formatPercentile: (percentile: number) => string;
  getClassificationStyle: (classification: string) => string;
}

export const AttentionTab: React.FC<AttentionTabProps> = ({
  session,
  getScoreColor,
  formatScore,
  formatPercentile,
  getClassificationStyle
}) => {
  if (!session.attention_details) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No detailed attention data available for this session</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Overall Score</div>
          <div className={`text-xl font-bold ${getScoreColor(session.attention_details.overall_score)}`}>
            {formatScore(session.attention_details.overall_score)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Percentile</div>
          <div className="text-xl font-bold">
            {formatPercentile(session.attention_details.percentile)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Classification</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(session.attention_details.classification)}`}>
            {session.attention_details.classification}
          </span>
        </div>
      </div>
      
      <div>
        <div className="font-medium mb-3 text-sm">Components</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-background shadow-sm">
            <div className="flex justify-between">
              <span className="font-medium">Crop Score</span>
              <span className={`font-bold ${getScoreColor(session.attention_details.components.crop_score)}`}>
                {formatScore(session.attention_details.components.crop_score)}
              </span>
            </div>
          </div>
          
          <div className="border rounded-md p-3 bg-background shadow-sm">
            <div className="flex justify-between">
              <span className="font-medium">Sequence Score</span>
              <span className={`font-bold ${getScoreColor(session.attention_details.components.sequence_score)}`}>
                {formatScore(session.attention_details.components.sequence_score)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
