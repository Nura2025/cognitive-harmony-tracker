
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { PerformanceTrend } from "@/components/analysis/PerformanceTrend";

interface PatientTrendTabProps {
  patientTrends: any;
}

const PatientTrendTab = ({ patientTrends }: PatientTrendTabProps) => {
  // Process trend data for the chart
  const processedTrendData = patientTrends ? patientTrends.map((session: any) => ({
    date: session.session_date,
    score: session.attention_score,
  })) : [];

  return (
    <Card className="glass">
      <CardContent className="pt-6">
        {!patientTrends || patientTrends.length === 0 ? (
          <p className="text-muted-foreground">
            No session data available.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Performance trend chart */}
            <PerformanceTrend 
              data={processedTrendData}
              title="Attention Score Trend" 
              description="Tracking attention performance over time"
            />
            
            {/* Session data list */}
            <div className="mt-6 space-y-4">
              <h4 className="text-md font-medium">Session Details</h4>
              {patientTrends.map((session: any, idx: number) => (
                <div key={idx} className="p-3 border rounded-md space-y-2">
                  <p className="text-sm font-medium">
                    {format(parseISO(session.session_date), "MMM d, yyyy")}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Attention
                      </span>
                      <p className="font-medium">
                        {session.attention_score}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Memory
                      </span>
                      <p className="font-medium">{session.memory_score}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Impulse
                      </span>
                      <p className="font-medium">{session.impulse_score}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Executive
                      </span>
                      <p className="font-medium">
                        {session.executive_score}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientTrendTab;
