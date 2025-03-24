
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { 
  Calendar, 
  CalendarClock, 
  CheckCircle2, 
  FileBarChart, 
  History, 
  UserRound 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';
import { usePatientAnalysis } from '@/hooks/use-patient-analysis';
import { useToast } from '@/hooks/use-toast';

const Analysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const { toast } = useToast();

  const { 
    isLoading, 
    error, 
    patient, 
    metrics, 
    sessions, 
    recommendations, 
    percentileData, 
    trendData,
    normativeData,
    subtypeData
  } = usePatientAnalysis(patientId);

  // Show error toast if there's an error
  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading analysis data',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Redirect if no patient ID is provided
  React.useEffect(() => {
    if (!patientId && !isLoading) {
      navigate('/patients');
    }
  }, [patientId, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading patient analysis...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Patient not found</p>
          <p className="text-muted-foreground mb-4">The requested patient could not be found.</p>
          <Button onClick={() => navigate('/patients')}>
            Return to Patients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Cognitive Analysis</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <UserRound className="h-4 w-4 mr-1" />
            <span>{patient.name}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>Age: {patient.age || 'Unknown'}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/sessions?patientId=' + patient.id)}>
            <CalendarClock className="h-4 w-4 mr-2" />
            View Sessions
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/reports?patientId=' + patient.id)}>
            <FileBarChart className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ADHD Subtype</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patient.adhd_subtype || "Not Specified"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on cognitive assessment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Severity Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.percentile && metrics.percentile < 40 ? "Severe" : 
               metrics?.percentile && metrics.percentile < 70 ? "Moderate" : 
               metrics?.percentile ? "Mild" : "Not Assessed"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall condition severity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {sessions.length > 0 && sessions[sessions.length - 1].start_time
                ? `Latest: ${format(parseISO(sessions[sessions.length - 1].start_time), 'MMM d, yyyy')}`
                : "No sessions recorded"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Domain Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <DomainComparison 
              patientData={metrics || {
                attention: 0,
                memory: 0,
                executive_function: 0,
                behavioral: 0
              }}
              normativeData={normativeData}
              subtypeData={subtypeData}
            />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceTrend 
              data={trendData || []} 
              title="Performance Over Time"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Session Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <SessionTimeline sessions={sessions} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <History className="h-8 w-8 mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-1">No Sessions Available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  There are no therapy sessions recorded for this patient yet.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/data-entry?type=session&patientId=' + patient.id)}
                >
                  Record New Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Domain Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attention Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Percentile Ranking</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-blue-600 h-4 rounded-full" 
                      style={{ width: `${metrics?.attention || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics?.attention || 0}%</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Key Observations</h4>
                <p className="text-sm text-muted-foreground">
                  {metrics?.attention < 50 ? 
                    "Shows difficulty maintaining sustained attention during tasks requiring focus." :
                    "Demonstrates good ability to maintain focus during attention-demanding tasks."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memory Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Percentile Ranking</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-purple-600 h-4 rounded-full" 
                      style={{ width: `${metrics?.memory || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics?.memory || 0}%</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Key Observations</h4>
                <p className="text-sm text-muted-foreground">
                  {metrics?.memory < 50 ? 
                    "Experiences challenges with working memory tasks requiring information retention." :
                    "Shows strong working memory capabilities across varied memory tasks."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Executive Function Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Percentile Ranking</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-green-600 h-4 rounded-full" 
                      style={{ width: `${metrics?.executive_function || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics?.executive_function || 0}%</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Key Observations</h4>
                <p className="text-sm text-muted-foreground">
                  {metrics?.executive_function < 50 ? 
                    "Struggles with planning and organizing multi-step activities." :
                    "Demonstrates effective planning and organizational skills."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Behavioral Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Percentile Ranking</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-red-600 h-4 rounded-full" 
                      style={{ width: `${metrics?.behavioral || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics?.behavioral || 0}%</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Key Observations</h4>
                <p className="text-sm text-muted-foreground">
                  {metrics?.behavioral < 50 ? 
                    "Exhibits impulsive responses and difficulty managing frustration during tasks." :
                    "Maintains appropriate response control and manages frustration effectively."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
