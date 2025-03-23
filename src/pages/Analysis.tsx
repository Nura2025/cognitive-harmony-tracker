
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
import { getPatients } from '@/services/patientService';
import { getPatientMetrics } from '@/services/patientService';
import { Patient, CognitiveDomain } from '@/types/databaseTypes';
import { CognitiveDomain as DomainComponent } from '@/components/analysis/CognitiveDomain';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { generatePercentileData, generateTrendData } from '@/utils/mockData';

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientMetrics, setPatientMetrics] = useState<any>(null);
  const [domainTrendData, setDomainTrendData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      const data = await getPatients();
      setPatients(data);
      setIsLoading(false);
    };
    
    fetchPatients();
  }, []);
  
  // Parse patient ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('patient');
    
    if (id && patients.some(p => p.id === id)) {
      setPatientId(id);
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
  }, [location, patients]);
  
  // Fetch metrics when patient changes
  useEffect(() => {
    if (!patientId) return;
    
    const fetchMetrics = async () => {
      const metrics = await getPatientMetrics(patientId);
      setPatientMetrics(metrics);
    };
    
    fetchMetrics();
    
    // Generate trend data for visualization
    setDomainTrendData({
      attention: generateTrendData('attention'),
      memory: generateTrendData('memory'),
      executive_function: generateTrendData('executive_function'),
      behavioral: generateTrendData('behavioral')
    });
  }, [patientId]);
  
  const handlePatientChange = (id: string) => {
    navigate(`/analysis?patient=${id}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  // Generate percentile comparison data
  const percentileData = generatePercentileData();
  
  // Generate performance trend data with validation
  const performanceTrendData = generateTrendData('attention', 60)
    .map(item => ({ 
      date: item.date, 
      score: typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0
    }));
  
  if (isLoading) {
    return <div className="p-8 pixel-text">Loading patient data...</div>;
  }
  
  if (!patientId || !patientMetrics) {
    return <div className="p-8 pixel-text">Select a patient to view analysis.</div>;
  }
  
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
          patientData={{
            attention: patientMetrics.attention,
            memory: patientMetrics.memory,
            executive_function: patientMetrics.executive_function,
            behavioral: patientMetrics.behavioral
          }}
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
        <DomainComponent 
          domain="attention"
          score={patientMetrics.attention}
          trendData={domainTrendData.attention || []}
        />
        <DomainComponent 
          domain="memory"
          score={patientMetrics.memory}
          trendData={domainTrendData.memory || []}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DomainComponent 
          domain="executive_function"
          score={patientMetrics.executive_function}
          trendData={domainTrendData.executive_function || []}
        />
        <DomainComponent 
          domain="behavioral"
          score={patientMetrics.behavioral}
          trendData={domainTrendData.behavioral || []}
        />
      </div>
    </div>
  );
};

export default Analysis;
