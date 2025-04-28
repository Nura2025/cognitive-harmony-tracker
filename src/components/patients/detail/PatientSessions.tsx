
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { TrendData } from '@/services/patient';

interface PatientSessionsProps {
  trendGraph: TrendData[];
  hasTrendData: boolean;
}

export const PatientSessions: React.FC<PatientSessionsProps> = ({ trendGraph, hasTrendData }) => {
  // Format score for display
  const formatScore = (score: number) => {
    return Math.round(score * 10) / 10; // Round to 1 decimal place
  };

  // Determine color based on score value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="glass">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Session Details</h3>
        </div>

        {!hasTrendData ? (
          <div className="p-8 text-center h-64 flex flex-col justify-center items-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              No session data available.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Sessions will appear after the patient completes assessments.
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-2">
            {trendGraph.map((session, idx) => (
              <div 
                key={idx} 
                className="p-3 border rounded-md space-y-2 hover:bg-accent/50 transition-colors mb-2"
              >
                <p className="text-sm font-medium">
                  {format(parseISO(session.session_date), "MMM d, yyyy")}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Attention
                    </span>
                    <p className={`font-medium ${getScoreColor(session.attention_score)}`}>
                      {formatScore(session.attention_score)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Memory
                    </span>
                    <p className={`font-medium ${getScoreColor(session.memory_score)}`}>
                      {formatScore(session.memory_score)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Impulse
                    </span>
                    <p className={`font-medium ${getScoreColor(session.impulse_score)}`}>
                      {formatScore(session.impulse_score)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Executive
                    </span>
                    <p className={`font-medium ${getScoreColor(session.executive_score)}`}>
                      {formatScore(session.executive_score)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
