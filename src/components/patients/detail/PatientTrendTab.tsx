
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface PatientTrendTabProps {
  patientTrends: any;
}

const PatientTrendTab = ({ patientTrends }: PatientTrendTabProps) => {
  return (
    <Card className="glass">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">
          Trend Graph (Sessions)
        </h3>

        {!patientTrends || patientTrends.length === 0 ? (
          <p className="text-muted-foreground">
            No session data available.
          </p>
        ) : (
          <div className="space-y-4">
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
        )}
      </CardContent>
    </Card>
  );
};

export default PatientTrendTab;
