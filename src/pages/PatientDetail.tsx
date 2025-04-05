import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, FileText, Calendar, Clock, User, ArrowUp } from 'lucide-react';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';
import { SessionAnalysis } from '@/components/sessions/SessionAnalysis';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { PatientReports } from '@/components/reports/PatientReports';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { PatientData, ReportType } from '@/utils/types/patientTypes';
import { 
  patients, 
  metricsMap, 
  sessionsMap, 
  reportsMap,
  mockNormativeData,
  mockSubtypeData
} from '@/utils/mockData';
import { formatPercentile, getScoreColorClass } from '@/utils/dataProcessing';
import { format, parseISO } from 'date-fns';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  
  useEffect(() => {
    const patient = patients.find(p => p.id === id);
    
    if (patient) {
      const metrics = metricsMap[patient.id];
      const sessions = sessionsMap[patient.id] || [];
      const reports = reportsMap[patient.id] || [];
      
      setPatientData({
        patient,
        metrics,
        sessions,
        reports
      });
      
      if (sessions.length > 0) {
        setSelectedSessionIndex(0);
      }
    } else {
      navigate('/patients');
    }
  }, [id, navigate]);
  
  const handleBackToPatients = () => {
    navigate('/patients');
  };
  
  const handleReportGenerate = (report: ReportType) => {
    if (patientData) {
      setPatientData({
        ...patientData,
        reports: [report, ...patientData.reports]
      });
      setActiveTab('reports');
    }
  };
  
  if (!patientData) {
    return <div className="p-8">Loading patient data...</div>;
  }
  
  const { patient, metrics, sessions, reports } = patientData;
  
  const firstSession = sessions.length > 0 
    ? sessions.reduce((earliest, session) => {
        return new Date(session.startTime) < new Date(earliest.startTime) 
          ? session : earliest;
      }, sessions[0])
    : null;
    
  const lastSession = sessions.length > 0 
    ? sessions.reduce((latest, session) => {
        return new Date(session.startTime) > new Date(latest.startTime) 
          ? session : latest;
      }, sessions[0])
    : null;
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4 -ml-2 text-muted-foreground"
        onClick={handleBackToPatients}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Patients
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{patient.name}</h1>
          <p className="text-muted-foreground">
            Patient ID: {patient.id} | Diagnosed: {patient.diagnosisDate}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5"
            onClick={() => setActiveTab('generate')}
          >
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-background border-2 border-card flex items-center justify-center">
                      <span className="text-xs font-medium">{patient.age}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Age</h3>
                    <p className="font-medium">{patient.age} years</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Gender</h3>
                    <p className="font-medium">{patient.gender}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">ADHD Subtype</h3>
                    <Badge variant="outline" className="font-normal">
                      {patient.adhdSubtype}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Total Sessions</h3>
                    <p className="font-medium">{patient.assessmentCount}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-base font-medium mb-3">Cognitive Performance</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Attention</span>
                          <span className="text-sm font-medium">{metrics.attention}%</span>
                        </div>
                        <Progress value={metrics.attention} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Memory</span>
                          <span className="text-sm font-medium">{metrics.memory}%</span>
                        </div>
                        <Progress value={metrics.memory} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Executive Function</span>
                          <span className="text-sm font-medium">{metrics.executiveFunction}%</span>
                        </div>
                        <Progress value={metrics.executiveFunction} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Behavioral</span>
                          <span className="text-sm font-medium">{metrics.behavioral}%</span>
                        </div>
                        <Progress value={metrics.behavioral} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h4 className="text-sm font-medium">First session</h4>
                    </div>
                    <p className="text-lg font-medium">
                      {firstSession 
                        ? format(parseISO(firstSession.startTime), 'MMM d, yyyy') 
                        : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h4 className="text-sm font-medium">Last session</h4>
                    </div>
                    <p className="text-lg font-medium">
                      {lastSession 
                        ? format(parseISO(lastSession.startTime), 'MMM d, yyyy') 
                        : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <ArrowUp className="h-4 w-4 mr-2 text-emerald-500" />
                      <h4 className="text-sm font-medium">Overall improvement</h4>
                    </div>
                    <p className="text-lg font-medium text-emerald-500">+{metrics.progress}%</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Progress Overview</h3>
                
                <div className="p-4 bg-muted/30 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-base font-medium">Cognitive Percentile</h4>
                      <p className="text-sm text-muted-foreground">
                        Compared to age-matched peers
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-2xl font-bold ${getScoreColorClass(metrics.percentile)}`}>
                        {formatPercentile(metrics.percentile)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-primary`}
                      style={{ width: `${metrics.percentile}%` }}
                    />
                  </div>
                </div>
                
                {sessions.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Session Timeline</h3>
                    <SessionTimeline 
                      sessions={sessions} 
                      title="" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sessions" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="glass md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Session History</h3>
                
                {sessions.length === 0 ? (
                  <p className="text-muted-foreground">No sessions available</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((session, index) => (
                      <div 
                        key={session.id}
                        onClick={() => setSelectedSessionIndex(index)}
                        className={`p-3 border border-border rounded-md cursor-pointer transition-colors
                          ${selectedSessionIndex === index ? 'bg-primary/10 border-primary/50' : 'hover:bg-muted/30'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {format(parseISO(session.startTime), 'MMM d, yyyy')}
                          </span>
                          <Badge 
                            variant={session.completionStatus === 'Completed' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {session.completionStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {format(parseISO(session.startTime), 'h:mm a')}
                            </span>
                          </div>
                          <span className={getScoreColorClass(session.overallScore)}>
                            {Math.round(session.overallScore)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="glass md:col-span-3">
              <CardContent className="pt-6">
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No session data available</p>
                  </div>
                ) : (
                  <SessionAnalysis session={sessions[selectedSessionIndex]} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="animate-fade-in space-y-6">
          <Card className="glass">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Cognitive Domain Analysis</h3>
              <DomainComparison 
                patientData={metrics}
                normativeData={mockNormativeData}
                subtypeData={mockSubtypeData}
                sessions={sessions}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="animate-fade-in space-y-6">
          <PatientReports 
            reports={reports}
            onViewReport={(report) => navigate(`/reports?patient=${patient.id}`)}
          />
        </TabsContent>
        
        <TabsContent value="generate" className="animate-fade-in space-y-6">
          <ReportGenerator 
            patient={patient}
            metrics={metrics}
            onReportGenerate={handleReportGenerate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
