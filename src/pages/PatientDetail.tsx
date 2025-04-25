
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientData } from '@/utils/types/patientTypes';
import { patients, metricsMap, sessionsMap, reportsMap, mockNormativeData, mockSubtypeData } from '@/utils/mockData';
import { generateTrendData } from '@/utils/generators/trendGenerators';
import { PatientHeader } from '@/components/patients/detail/PatientHeader';
import { PatientProfile } from '@/components/patients/detail/PatientProfile';
import { PatientSessions } from '@/components/patients/detail/PatientSessions';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { PatientReports } from '@/components/reports/PatientReports';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { ReportType } from '@/utils/types/patientTypes';

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
  
  const domainTrendData = {
    attention: generateTrendData('attention', 10).map(item => item.value),
    memory: generateTrendData('memory', 10).map(item => item.value),
    executiveFunction: generateTrendData('executiveFunction', 10).map(item => item.value),
    behavioral: generateTrendData('behavioral', 10).map(item => item.value)
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <PatientHeader 
        patient={patient}
        onBackClick={handleBackToPatients}
        onGenerateReport={() => setActiveTab('generate')}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="animate-fade-in">
          <PatientProfile 
            patient={patient}
            metrics={metrics}
            domainTrendData={domainTrendData}
          />
        </TabsContent>
        
        <TabsContent value="sessions" className="animate-fade-in">
          <PatientSessions 
            sessions={sessions}
            selectedSessionIndex={selectedSessionIndex}
            onSessionSelect={setSelectedSessionIndex}
          />
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
