
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Brain, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CognitiveDomain } from '@/components/analysis/CognitiveDomain';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { 
  patients, 
  patientMetrics,
  metricsMap,
  sessionsMap,
  mockPatientData,
  mockNormativeData,
  mockSubtypeData,
  generateTrendData,
  generatePercentileData
} from '@/utils/mockData';
import { Patient, PatientMetrics, CognitiveDomain as CognitiveDomainType } from '@/types/databaseTypes';

const Analysis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const patientParam = searchParams.get('patient');
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patientParam);
  const [selectedDomain, setSelectedDomain] = useState<keyof CognitiveDomainType>('attention');
  
  // Find the selected patient's info
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientMetric = selectedPatientId ? metricsMap[selectedPatientId] : null;
  const patientSessions = selectedPatientId ? sessionsMap[selectedPatientId] || [] : [];
  
  // Generate mock trend data for the selected patient and domain
  const trendData = generateTrendData(selectedDomain, 12);
  const percentileData = generatePercentileData();
  
  // Navigate between patients
  const navigateToPatient = (direction: 'prev' | 'next') => {
    const currentIndex = patients.findIndex(p => p.id === selectedPatientId);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? patients.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === patients.length - 1 ? 0 : currentIndex + 1;
    }
    
    const newPatientId = patients[newIndex].id;
    setSelectedPatientId(newPatientId);
    setSearchParams({ patient: newPatientId });
  };
  
  // Update URL if patient param changes
  useEffect(() => {
    if (patientParam && patientParam !== selectedPatientId) {
      setSelectedPatientId(patientParam);
    }
  }, [patientParam]);
  
  // If no patient is selected, show message
  if (!selectedPatient || !patientMetric) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="h-16 w-16 mx-auto text-primary/60" />
          <h2 className="text-2xl font-semibold">No Patient Selected</h2>
          <p className="text-muted-foreground max-w-md">
            Select a patient from the dashboard or patients list to view their cognitive analysis.
          </p>
          {patients.length > 0 && (
            <Button
              onClick={() => {
                const firstPatient = patients[0];
                setSelectedPatientId(firstPatient.id);
                setSearchParams({ patient: firstPatient.id });
              }}
            >
              View First Patient
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Cognitive Analysis</h1>
          <p className="text-muted-foreground">
            Detailed assessment results for {selectedPatient.name}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateToPatient('prev')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous Patient</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateToPatient('next')}
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next Patient</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="domains">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="domains">Cognitive Domains</TabsTrigger>
          <TabsTrigger value="comparison">Domain Comparison</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="domains" className="mt-6">
          <CognitiveDomain
            patient={selectedPatient}
            metrics={patientMetric}
            sessions={patientSessions}
            domain={selectedDomain}
            setDomain={setSelectedDomain}
            patientData={mockPatientData}
            normativeData={mockNormativeData}
            subtypeData={mockSubtypeData}
          />
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-6">
          <DomainComparison
            patient={selectedPatient}
            metrics={patientMetric}
            data={{
              attention: patientMetric.attention,
              memory: patientMetric.memory,
              executive_function: patientMetric.executive_function,
              behavioral: patientMetric.behavioral
            }}
          />
        </TabsContent>
        
        <TabsContent value="trends" className="mt-6">
          <PerformanceTrend
            patient={selectedPatient}
            domain={selectedDomain}
            setDomain={setSelectedDomain}
            trendData={trendData}
            percentileData={percentileData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;
