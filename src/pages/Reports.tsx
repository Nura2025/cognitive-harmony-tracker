
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';
import { 
  patients, 
  metricsMap, 
  reportsMap,
  mockPatientData, 
  mockNormativeData, 
  mockSubtypeData,
  ReportType
} from '@/utils/mockData';
import { randomInt } from '@/utils/helpers/randomUtils';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { PatientReports } from '@/components/reports/PatientReports';
import { toast } from "@/hooks/use-toast";

// Mock data for test scores
const testScores = {
  attention: {
    sustainedAttention: randomInt(60, 95),
    selectiveAttention: randomInt(55, 90),
    dividedAttention: randomInt(50, 85),
    attentionalSwitching: randomInt(45, 80),
  },
  memory: {
    workingMemory: randomInt(55, 90),
    shortTermMemory: randomInt(60, 95),
    longTermMemory: randomInt(65, 95),
    visualMemory: randomInt(50, 85),
  },
  executiveFunction: {
    inhibition: randomInt(40, 75),
    planning: randomInt(45, 80),
    problemSolving: randomInt(50, 85),
    decisionMaking: randomInt(55, 90),
  },
  behavioral: {
    emotionalRegulation: randomInt(35, 70),
    impulseControl: randomInt(30, 65),
    socialCognition: randomInt(45, 80),
    selfMonitoring: randomInt(40, 75),
  }
};

// Mock recommendations
const recommendations = [
  {
    domain: 'Attention',
    strategies: [
      'Daily mindfulness meditation practice (10-15 minutes)',
      'Use of external timers and reminders for task management',
      'Implementation of the Pomodoro technique for focused work periods',
      'Regular physical exercise to improve overall attentional capacity'
    ]
  },
  {
    domain: 'Memory',
    strategies: [
      'Spaced repetition techniques for important information',
      'Use of visual organizers and mind maps',
      'Implementation of memory palace techniques for complex information',
      'Regular sleep hygiene practices to support memory consolidation'
    ]
  },
  {
    domain: 'Executive Function',
    strategies: [
      'Breaking complex tasks into smaller, manageable steps',
      'Use of structured planning tools and digital organizers',
      'Regular review and reflection on completed tasks',
      'Implementation of if-then planning for anticipated challenges'
    ]
  },
  {
    domain: 'Behavioral Regulation',
    strategies: [
      'Regular practice of emotional awareness techniques',
      'Use of structured response delay strategies for emotional situations',
      'Implementation of regular self-monitoring practices',
      'Development of specific social scripts for challenging interactions'
    ]
  }
];

const Reports: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientReports, setPatientReports] = useState<ReportType[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  // Parse patient ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('patient');
    
    if (id && patients.some(p => p.id === id)) {
      setPatientId(id);
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
  }, [location]);
  
  // Update patient reports when patient changes
  useEffect(() => {
    if (patientId) {
      const reports = reportsMap[patientId] || [];
      setPatientReports(reports);
      
      if (reports.length > 0 && !selectedReportId) {
        setSelectedReportId(reports[0].id);
      }
    }
  }, [patientId]);
  
  const handlePatientChange = (id: string) => {
    navigate(`/reports?patient=${id}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  const handleReportGenerate = (report: ReportType) => {
    setPatientReports(prev => [report, ...prev]);
    setSelectedReportId(report.id);
    setActiveTab('viewReport');
  };
  
  const handleViewReport = (report: ReportType) => {
    setSelectedReportId(report.id);
    setActiveTab('viewReport');
  };
  
  // Find the current patient
  const currentPatient = patients.find(p => p.id === patientId);
  const patientMetrics = patientId ? metricsMap[patientId] : null;
  const selectedReport = patientReports.find(r => r.id === selectedReportId);
  
  if (!currentPatient || !patientMetrics) {
    return <div className="p-8">Loading patient data...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2 -ml-2 text-muted-foreground"
              onClick={handleBackToDashboard}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mb-2">Cognitive Assessment Reports</h1>
            <p className="text-muted-foreground">
              Generate and manage detailed cognitive assessment reports
            </p>
          </div>
          
          <div className="min-w-[200px]">
            <Select value={patientId || ''} onValueChange={handlePatientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-muted-foreground block">Patient</span>
              <span className="font-medium">{currentPatient.name}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Age / Gender</span>
              <span className="font-medium">{currentPatient.age} / {currentPatient.gender}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Diagnosis Date</span>
              <span className="font-medium">{currentPatient.diagnosisDate}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">ADHD Subtype</span>
              <span className="font-medium">{currentPatient.adhdSubtype}</span>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="reports">Patient Reports</TabsTrigger>
          <TabsTrigger value="viewReport" disabled={!selectedReport}>
            View Report
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This cognitive assessment evaluates performance across four key domains: 
                  Attention, Memory, Executive Function, and Behavioral Regulation.
                </p>
                <p>
                  Results indicate relative strengths in Memory and Attention domains, 
                  with opportunities for development in Executive Function and Behavioral 
                  Regulation. Specific strategies are recommended to support cognitive 
                  functioning in daily activities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <CardTitle>Domain Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Attention</Label>
                    <span className="text-sm">{patientMetrics.attention}%</span>
                  </div>
                  <Progress value={patientMetrics.attention} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Memory</Label>
                    <span className="text-sm">{patientMetrics.memory}%</span>
                  </div>
                  <Progress value={patientMetrics.memory} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Executive Function</Label>
                    <span className="text-sm">{patientMetrics.executiveFunction}%</span>
                  </div>
                  <Progress value={patientMetrics.executiveFunction} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Behavioral Regulation</Label>
                    <span className="text-sm">{patientMetrics.behavioral}%</span>
                  </div>
                  <Progress value={patientMetrics.behavioral} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DomainComparison 
            patientData={patientMetrics} 
            normativeData={mockNormativeData}
          />
        </TabsContent>
        
        {/* Generate Report Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportGenerator 
              patient={currentPatient} 
              metrics={patientMetrics} 
              onReportGenerate={handleReportGenerate}
            />
            
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Report Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The generated report will include comprehensive analysis of cognitive 
                  performance based on the selected sections.
                </p>
                <p className="mb-4">
                  Reports can be shared with healthcare providers, educational institutions, 
                  or other stakeholders through our secure platform.
                </p>
                <p>
                  Each report is customized to address specific needs while maintaining 
                  clinical accuracy and relevance.
                </p>
                <Separator className="my-4" />
                <h4 className="font-medium mb-2">Available Report Types</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 bg-primary"></div>
                    <span><strong>Clinical Report:</strong> Comprehensive assessment for healthcare providers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 bg-primary"></div>
                    <span><strong>School Accommodation:</strong> Focused on educational support recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 bg-primary"></div>
                    <span><strong>Progress Summary:</strong> Tracking changes over time with trend analysis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 bg-primary"></div>
                    <span><strong>Detailed Analysis:</strong> In-depth breakdown of all cognitive domains</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Patient Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <PatientReports 
            reports={patientReports}
            onViewReport={handleViewReport}
          />
        </TabsContent>
        
        {/* View Report Tab */}
        <TabsContent value="viewReport" className="space-y-6">
          {selectedReport ? (
            <>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{selectedReport.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {selectedReport.sections.overview && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Patient Overview</h3>
                        <p>
                          {currentPatient.name} is a {currentPatient.age}-year-old {currentPatient.gender.toLowerCase()} 
                          diagnosed with {currentPatient.adhdSubtype} ADHD on {currentPatient.diagnosisDate}. The patient 
                          has completed {patientMetrics.sessionsCompleted} cognitive assessment sessions.
                        </p>
                      </div>
                    )}
                    
                    {selectedReport.sections.domainAnalysis && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Cognitive Domain Analysis</h3>
                        <DomainComparison 
                          patientData={patientMetrics} 
                          normativeData={mockNormativeData}
                          subtypeData={mockSubtypeData}
                        />
                      </div>
                    )}
                    
                    {selectedReport.sections.recommendations && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                        <div className="space-y-4">
                          {recommendations.map((rec) => (
                            <div key={rec.domain}>
                              <h4 className="font-medium mb-2">{rec.domain}</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {rec.strategies.map((strategy, index) => (
                                  <li key={index} className="text-muted-foreground">{strategy}</li>
                                ))}
                              </ul>
                              {rec.domain !== recommendations[recommendations.length - 1].domain && (
                                <Separator className="my-3" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setActiveTab('reports')}>
                  Back to Reports
                </Button>
                <Button>Download PDF</Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No report selected</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
