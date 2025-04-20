
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CognitiveDomain } from '@/components/analysis/CognitiveDomain';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { generatePercentileData, generateTrendData } from '@/utils/functions/dataGenerators';
import { PatientMetrics, CognitiveDomainMetrics } from '@/utils/types/patientTypes';

// Mock data for patients until we integrate with an API
const patients = [
  { id: "p1", name: "Alex Johnson" },
  { id: "p2", name: "Maria Garcia" }
];

// Mock metrics data 
const metricsMap: Record<string, PatientMetrics> = {
  "p1": {
    patientId: "p1",
    date: "2024-04-10",
    attention: 75,
    memory: 82,
    executiveFunction: 68,
    behavioral: 70,
    impulseControl: 65,
    percentile: 76,
    sessionsDuration: 120,
    sessionsCompleted: 5,
    progress: 8,
    clinicalConcerns: ["Task initiation", "Sustained attention"]
  },
  "p2": {
    patientId: "p2",
    date: "2024-04-12",
    attention: 65,
    memory: 72,
    executiveFunction: 78,
    behavioral: 80,
    impulseControl: 75,
    percentile: 72,
    sessionsDuration: 150,
    sessionsCompleted: 6,
    progress: 12,
    clinicalConcerns: ["Emotional regulation"]
  }
};

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [domainTrendData, setDomainTrendData] = useState<Record<string, any>>({});
  
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
  
  // Generate trend data when patient changes
  useEffect(() => {
    if (!patientId) return;
    
    setDomainTrendData({
      attention: generateTrendData('attention'),
      memory: generateTrendData('memory'),
      executiveFunction: generateTrendData('executiveFunction'),
      behavioral: generateTrendData('behavioral')
    });
  }, [patientId]);
  
  const handlePatientChange = (id: string) => {
    navigate(`/analysis?patient=${id}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  // Find the current patient
  const currentPatient = patients.find(p => p.id === patientId);
  const patientMetrics = patientId ? metricsMap[patientId] : null;
  
  // Generate percentile comparison data
  const percentileData = generatePercentileData();
  
  // Generate performance trend data with validation
  const performanceTrendData = generateTrendData('attention', 60)
    .map(item => ({ 
      date: item.date, 
      score: typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0
    }));
  
  if (!currentPatient || !patientMetrics) {
    return <div className="p-8 pixel-text">Loading patient data...</div>;
  }
  
  // Create a CognitiveDomainMetrics object from PatientMetrics
  const patientDomainMetrics: CognitiveDomainMetrics = {
    attention: patientMetrics.attention,
    memory: patientMetrics.memory,
    executiveFunction: patientMetrics.executiveFunction,
    impulseControl: patientMetrics.impulseControl || 0,
    behavioral: patientMetrics.behavioral
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
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
          <h1 className="text-3xl font-bold mb-1 nura-title">NURA Cognitive Analysis</h1>
          <p className="text-muted-foreground">
            Detailed cognitive domain assessment and trends
          </p>
        </div>
        
        <div className="min-w-[200px]">
          <Select value={patientId || ''} onValueChange={handlePatientChange}>
            <SelectTrigger className="pixel-border">
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <DomainComparison 
          patientData={patientDomainMetrics}
          normativeData={percentileData.ageGroup}
          subtypeData={percentileData.adhdSubtype}
        />
        <PerformanceTrend 
          data={performanceTrendData}
          title="Overall Performance Trend"
          description="90-day progress tracking across all cognitive metrics"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <CognitiveDomain 
          domain="attention"
          score={patientMetrics.attention}
          trendData={domainTrendData.attention || []}
        />
        <CognitiveDomain 
          domain="memory"
          score={patientMetrics.memory}
          trendData={domainTrendData.memory || []}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <CognitiveDomain 
          domain="executiveFunction"
          score={patientMetrics.executiveFunction}
          trendData={domainTrendData.executiveFunction || []}
        />
        <CognitiveDomain 
          domain="behavioral"
          score={patientMetrics.behavioral}
          trendData={domainTrendData.behavioral || []}
        />
      </div>
    </div>
  );
};

export default Analysis;
