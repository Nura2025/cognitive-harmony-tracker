
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import { User } from "lucide-react";

interface PatientProfileTabProps {
  patientProfile: any;
}

const PatientProfileTab = ({ patientProfile }: PatientProfileTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">{patientProfile.user_name}</h2>
            <p className="text-muted-foreground">{patientProfile.gender}</p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Age</h3>
              <p className="font-medium">{patientProfile.age} years</p>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">
                ADHD Subtype
              </h3>
              <Badge variant="outline">
                {patientProfile.adhd_subtype ?? "N/A"}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">
                Total Sessions
              </h3>
              <p className="font-medium">{patientProfile.total_sessions}</p>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">
                First Session
              </h3>
              <p className="font-medium">
                {patientProfile.first_session_date
                  ? format(
                      parseISO(patientProfile.first_session_date),
                      "MMM d, yyyy"
                    )
                  : "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">
                Last Session
              </h3>
              <p className="font-medium">
                {patientProfile.last_session_date
                  ? format(
                      parseISO(patientProfile.last_session_date),
                      "MMM d, yyyy"
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">
            Average Domain Scores
          </h3>

          <div className="space-y-6">
            <div>
              <p className="text-sm mb-1">Memory</p>
              <Progress value={patientProfile.avg_domain_scores?.memory ?? 0} />
            </div>
            <div>
              <p className="text-sm mb-1">Attention</p>
              <Progress
                value={patientProfile.avg_domain_scores?.attention ?? 0}
              />
            </div>
            <div>
              <p className="text-sm mb-1">Impulse Control</p>
              <Progress
                value={patientProfile.avg_domain_scores?.impulse_control ?? 0}
              />
            </div>
            <div>
              <p className="text-sm mb-1">Executive Function</p>
              <Progress
                value={patientProfile.avg_domain_scores?.executive_function ?? 0}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfileTab;
