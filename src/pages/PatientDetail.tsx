
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClipboardCheck, AlertCircle, Brain, Calendar, ChevronLeft } from 'lucide-react';
import { PatientData, ReportType, CognitiveDomain, CognitiveDomainMetrics } from '@/utils/types/patientTypes';
import { 
  formatPercentile, 
  getScoreColorClass, 
  formatLastSession
} from '@/utils/dataProcessing';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';
import { PatientReports } from '@/components/reports/PatientReports';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { CognitiveDomainChart } from '@/components/cognitive/CognitiveDomainChart';

const PatientDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Simulate data fetching
  useEffect(() => {
    // In a real app, this would be fetched from an API
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        // const data = await fetchPatientById(params.id);
        
        // For now, using mock data
        setTimeout(() => {
          // Mock patient data - this would normally come from an API
          const mockData: PatientData = {
            patient: {
              id: params.id || 'unknown',
              name: 'Alex Johnson',
              age: 12,
              gender: 'Male',
              diagnosisDate: '2023-04-12',
              adhdSubtype: 'Combined',
              assessmentCount: 8,
              lastAssessment: '2023-11-02'
            },
            metrics: {
              patientId: params.id || 'unknown',
              date: '2023-11-02',
              attention: 68,
              memory: 81,
              executiveFunction: 59,
              behavioral: 52,
              impulseControl: 56,
              percentile: 65,
              sessionsDuration: 240,
              sessionsCompleted: 8,
              progress: 15,
              clinicalConcerns: ['Attention Span', 'Task Completion', 'Organization']
            },
            sessions: [
              {
                id: 'session-1',
                patientId: params.id || 'unknown',
                startTime: '2023-08-15T10:30:00',
                endTime: '2023-08-15T11:15:00',
                completionStatus: 'Completed',
                overallScore: 62,
                domainScores: {
                  attention: 58,
                  memory: 70,
                  executiveFunction: 55,
                  behavioral: 48
                },
                activities: []
              },
              // More sessions...
            ],
            reports: [
              {
                id: 'report-1',
                patientId: params.id || 'unknown',
                title: 'Cognitive Assessment Report',
                date: '2023-11-03',
                type: 'clinical',
                status: 'generated',
                createdDate: '2023-11-03'
              },
              {
                id: 'report-2',
                patientId: params.id || 'unknown',
                title: 'School Accommodation Report',
                date: '2023-09-15',
                type: 'school',
                status: 'shared',
                createdDate: '2023-09-15'
              }
            ]
          };
          
          setPatientData(mockData);
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setIsLoading(false);
      }
    };
    
    fetchPatientData();
  }, [params.id]);
  
  const handleBackToPatients = () => {
    navigate('/patients');
  };
  
  const handleViewReport = (report: ReportType) => {
    navigate(`/reports?patient=${params.id}&report=${report.id}`);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center mb-6">
          <div className="w-full">
            <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-8 w-64 mt-2 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
        </div>
        <div className="h-80 bg-muted animate-pulse rounded-lg"></div>
      </div>
    );
  }
  
  if (!patientData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium mb-2">Patient Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The patient information you're looking for could not be found.
        </p>
        <Button onClick={handleBackToPatients}>
          Return to Patients List
        </Button>
      </div>
    );
  }
  
  const { patient, metrics, sessions, reports } = patientData;
  
  // Process sessions for performance trends
  const generatePerformanceData = (domain: keyof CognitiveDomain) => {
    return sessions.map(session => ({
      date: new Date(session.startTime).toISOString().split('T')[0],
      score: session.domainScores[domain],
      duration: new Date(session.endTime).getTime() - new Date(session.startTime).getTime() / 1000 / 60 // in minutes
    }));
  };
  
  // Format domain data for the radar chart
  const domainData = {
    attention: metrics.attention,
    memory: metrics.memory,
    executiveFunction: metrics.executiveFunction,
    impulseControl: metrics.impulseControl || 0,
    behavioral: metrics.behavioral
  };
  
  const trendData = {
    attention: generatePerformanceData('attention'),
    memory: generatePerformanceData('memory'),
    executiveFunction: generatePerformanceData('executiveFunction'),
    behavioral: generatePerformanceData('behavioral'),
    impulseControl: [] // Placeholder since we may not have direct impulse control data
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-2 -ml-2 text-muted-foreground"
          onClick={handleBackToPatients}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Patients
        </Button>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1">
          <h1 className="text-3xl font-bold">{patient.name}</h1>
          <div className="flex items-center gap-3 mt-2 lg:mt-0">
            <Badge className="text-xs">{patient.age} y/o {patient.gender}</Badge>
            <Badge variant="outline" className="text-xs">{patient.adhdSubtype} Type</Badge>
            <Badge variant="secondary" className="text-xs">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              Diagnosed {new Date(patient.diagnosisDate).toLocaleDateString()}
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">
          Detailed patient profile and assessment records
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Overall Cognitive Score</p>
                <p className="text-sm text-muted-foreground">Combined performance</p>
              </div>
              <div className={`${getScoreColorClass(metrics.percentile)} text-xl font-bold`}>
                {formatPercentile(metrics.percentile)}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Attention</span>
                  <span className={getScoreColorClass(metrics.attention)}>
                    {formatPercentile(metrics.attention)}
                  </span>
                </div>
                <Progress value={metrics.attention} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Memory</span>
                  <span className={getScoreColorClass(metrics.memory)}>
                    {formatPercentile(metrics.memory)}
                  </span>
                </div>
                <Progress value={metrics.memory} className="bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Executive Function</span>
                  <span className={getScoreColorClass(metrics.executiveFunction)}>
                    {formatPercentile(metrics.executiveFunction)}
                  </span>
                </div>
                <Progress value={metrics.executiveFunction} className="bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Impulse Control</span>
                  <span className={getScoreColorClass(metrics.impulseControl || 0)}>
                    {formatPercentile(metrics.impulseControl || 0)}
                  </span>
                </div>
                <Progress value={metrics.impulseControl || 0} className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Session History</p>
              <p className="text-sm text-muted-foreground">Assessment tracking</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Activity</span>
                <span className="font-medium">
                  {formatLastSession(patient.lastAssessment)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Sessions</span>
                <span className="font-medium">{patient.assessmentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. Duration</span>
                <span className="font-medium">
                  {Math.round(metrics.sessionsDuration / metrics.sessionsCompleted)} mins
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completion Rate</span>
                <span className={`font-medium ${
                  metrics.sessionsCompleted / patient.assessmentCount >= 0.8 
                    ? 'text-green-600' 
                    : 'text-amber-600'
                }`}>
                  {Math.round((metrics.sessionsCompleted / patient.assessmentCount) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Overall Progress</p>
              <p className="text-sm text-muted-foreground">Improvement over time</p>
            </div>
            <div className="flex items-center justify-center mt-5 mb-2">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <Brain className="h-12 w-12 text-primary opacity-90" />
                </div>
                <div className="absolute top-0 right-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 border-4 border-background">
                    <span className="text-xs font-semibold text-green-800">+{metrics.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="font-medium">
                {metrics.progress >= 15 
                  ? 'Significant Improvement' 
                  : metrics.progress >= 5 
                    ? 'Steady Progress' 
                    : 'Gradual Improvement'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Last 30 Days
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Clinical Notes</p>
              <p className="text-sm text-muted-foreground">Areas of concern</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-start">
                <ClipboardCheck className="h-5 w-5 mt-0.5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Focus Areas</p>
                  <ul className="mt-1 space-y-1">
                    {metrics.clinicalConcerns.map((concern, i) => (
                      <li key={i} className="flex items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-1.5"></div>
                        <span className="text-xs text-muted-foreground">{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm">Latest Report</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto"
                  onClick={() => reports[0] && handleViewReport(reports[0])}
                >View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <CognitiveDomainChart 
              patientData={domainData as unknown as CognitiveDomainMetrics}
              normativeData={{} as CognitiveDomainMetrics}
              subtypeData={{} as CognitiveDomainMetrics}
            />
            <PerformanceTrend 
              data={trendData.attention}
              title="Attention Performance"
              description="Tracking focus and sustained attention over time"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <PerformanceTrend 
              data={trendData.memory}
              title="Memory Performance"
              description="Working and visual memory recall metrics"
            />
            <PerformanceTrend 
              data={trendData.executiveFunction}
              title="Executive Function"
              description="Planning, organization, and cognitive flexibility trends"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Session Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionTimeline sessions={sessions} title="All Sessions" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <PatientReports 
            reports={reports}
            onViewReport={handleViewReport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
