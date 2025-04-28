
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { ChevronLeft, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientData } from "@/hooks/usePatientData";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { patientProfile, patientTrends, patientSessions, loading, error } = usePatientData(id);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  if (loading) {
    return <div className="p-8">Loading patient data...</div>;
  }

  if (error || !patientProfile) {
    return <div className="p-8">Patient not found or error loading data.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 text-muted-foreground"
        onClick={() => navigate("/patients")}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Patients
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{patientProfile.user_name}</h1>
          <p className="text-muted-foreground">Patient ID: {patientProfile.user_id}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="trend">Trend</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
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
        </TabsContent>

        {/* Trend Tab */}
        <TabsContent value="trend">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
