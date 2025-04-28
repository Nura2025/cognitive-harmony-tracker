import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { AlertCircle, ChevronLeft, LineChart as LineChartIcon, User, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Services
import PatientService from "@/services/patient";

// Define types based on API response
interface DomainScores {
  memory: number;
  attention: number;
  impulse_control: number;
  executive_function: number;
}

interface TrendData {
  session_date: string;
  attention_score: number;
  memory_score: number;
  impulse_score: number;
  executive_score: number;
}

interface PatientProfile {
  user_id: string;
  user_name: string;
  age: number;
  age_group: string;
  gender: string;
  total_sessions: number;
  first_session_date: string | null;
  last_session_date: string | null;
  adhd_subtype: string | null;
  avg_domain_scores: DomainScores;
  trend_graph: TrendData[];
}

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const fetchPatient = async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await PatientService.getPatientProfile(patientId);
      setPatient(data);
    } catch (error) {
      console.error("Failed to fetch patient profile:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch patient data");
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/patients");
      return;
    }
    
    fetchPatient(id);
  }, [id, navigate]);

  const handleRetry = () => {
    if (!id) return;
    setRetrying(true);
    fetchPatient(id);
  };

  // Format date for XAxis
  const formatXAxis = (tickItem: string) => {
    try {
      return format(parseISO(tickItem), "MMM d");
    } catch (e) {
      return tickItem; // Fallback if parsing fails
    }
  };

  // Format score for Tooltip and YAxis
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

  // Loading state with skeletons for better UX
  if (loading) {
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
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="trend">Trend</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-48 mb-6" />
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
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
        
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Patient Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/patients")}
          >
            Return to Patients List
          </Button>
          <Button 
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (!patient) {
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
        
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Patient Not Found</AlertTitle>
          <AlertDescription>The requested patient could not be found or has been removed.</AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          onClick={() => navigate("/patients")}
        >
          Return to Patients List
        </Button>
      </div>
    );
  }

  // Check if trend data is valid
  const hasTrendData = patient.trend_graph && patient.trend_graph.length > 0;

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
          <h1 className="text-3xl font-bold mb-1">{patient.user_name}</h1>
          <p className="text-muted-foreground">Patient ID: {patient.user_id}</p>
        </div>
        <div className="mt-2 md:mt-0 flex gap-2">
          <Badge variant="outline" className="text-sm">
            {patient.age_group}
          </Badge>
          {patient.adhd_subtype && (
            <Badge variant="secondary" className="text-sm">
              {patient.adhd_subtype}
            </Badge>
          )}
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
                  <h2 className="text-2xl font-bold">{patient.user_name}</h2>
                  <p className="text-muted-foreground">{patient.gender}</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Age</h3>
                    <p className="font-medium">{patient.age} years</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      ADHD Subtype
                    </h3>
                    <Badge variant="outline">
                      {patient.adhd_subtype ?? "N/A"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      Total Sessions
                    </h3>
                    <p className="font-medium">{patient.total_sessions}</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">
                      First Session
                    </h3>
                    <p className="font-medium">
                      {patient.first_session_date
                        ? format(
                            parseISO(patient.first_session_date),
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
                      {patient.last_session_date
                        ? format(
                            parseISO(patient.last_session_date),
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
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Memory</p>
                      <p className={`text-sm font-medium ${getScoreColor(patient.avg_domain_scores?.memory ?? 0)}`}>
                        {formatScore(patient.avg_domain_scores?.memory ?? 0)}
                      </p>
                    </div>
                    <Progress 
                      value={patient.avg_domain_scores?.memory ?? 0} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Attention</p>
                      <p className={`text-sm font-medium ${getScoreColor(patient.avg_domain_scores?.attention ?? 0)}`}>
                        {formatScore(patient.avg_domain_scores?.attention ?? 0)}
                      </p>
                    </div>
                    <Progress
                      value={patient.avg_domain_scores?.attention ?? 0}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Impulse Control</p>
                      <p className={`text-sm font-medium ${getScoreColor(patient.avg_domain_scores?.impulse_control ?? 0)}`}>
                        {formatScore(patient.avg_domain_scores?.impulse_control ?? 0)}
                      </p>
                    </div>
                    <Progress
                      value={patient.avg_domain_scores?.impulse_control ?? 0}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Executive Function</p>
                      <p className={`text-sm font-medium ${getScoreColor(patient.avg_domain_scores?.executive_function ?? 0)}`}>
                        {formatScore(patient.avg_domain_scores?.executive_function ?? 0)}
                      </p>
                    </div>
                    <Progress
                      value={patient.avg_domain_scores?.executive_function ?? 0}
                      className="h-2"
                    />
                  </div>
                </div>

                {patient.total_sessions === 0 && (
                  <Alert className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Sessions</AlertTitle>
                    <AlertDescription>
                      This patient has no recorded sessions yet. Scores will be updated after the first session.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trend Tab - Enhanced with Recharts */}
        <TabsContent value="trend">
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Cognitive Score Trends</h3>
                <LineChartIcon className="h-5 w-5 text-muted-foreground" />
              </div>

              {!hasTrendData ? (
                <div className="p-8 text-center h-64 flex flex-col justify-center items-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No session data available to display trends.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Trends will appear after the patient completes sessions.
                  </p>
                </div>
              ) : (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={patient.trend_graph}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="session_date" 
                        tickFormatter={formatXAxis} 
                        fontSize={12}
                        tickMargin={5}
                      />
                      <YAxis 
                        fontSize={12}
                        tickMargin={5}
                        domain={[0, 100]} // Assuming scores are 0-100
                      />
                      <Tooltip 
                        formatter={(value: number) => formatScore(value)}
                        labelFormatter={(label: string) => format(parseISO(label), "MMM d, yyyy")}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="attention_score" 
                        stroke="#8884d8" 
                        name="Attention"
                        dot={true}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="memory_score" 
                        stroke="#82ca9d" 
                        name="Memory"
                        dot={true}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="impulse_score" 
                        stroke="#ffc658" 
                        name="Impulse"
                        dot={true}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="executive_score" 
                        stroke="#ff7300" 
                        name="Executive"
                        dot={true}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {hasTrendData && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium">Session Details</h4>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    {patient.trend_graph.map((session, idx) => (
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
