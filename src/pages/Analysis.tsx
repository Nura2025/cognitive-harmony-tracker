
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
import { patients } from '@/utils/mockData';
import { PatientAnalysis } from '@/components/patients/detail/PatientAnalysis';
import { TrendData } from '@/services/patient';

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  
  // Parse patient ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('patient');
    
    if (id && patients.some(p => p.id === id)) {
      setPatientId(id);
      
      // Get trend data for the selected patient
      // In a real app, this would come from an API call
      // For demo purposes, we'll use sample data
      const sampleTrendData = generateSampleTrendData();
      setTrendData(sampleTrendData);
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
      
      // Get trend data for the first patient
      const sampleTrendData = generateSampleTrendData();
      setTrendData(sampleTrendData);
    }
  }, [location]);
  
  // Generate sample data for demonstration
  // In a real app, this would be replaced with actual API data
  const generateSampleTrendData = (): TrendData[] => {
    // Create trend data for the past 90 days
    const trendData: TrendData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    
    for (let i = 0; i < 12; i++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(sessionDate.getDate() + (i * 7)); // weekly data
      
      const baseScore = 50 + (i * 2); // Scores improve over time
      const variability = 10; // Random variation
      
      trendData.push({
        session_id: `session-${i}`,
        session_date: sessionDate.toISOString().split('T')[0],
        attention_score: Math.min(100, Math.max(0, baseScore + Math.random() * variability - variability/2)),
        memory_score: Math.min(100, Math.max(0, baseScore + Math.random() * variability - variability/2)),
        executive_score: Math.min(100, Math.max(0, baseScore + Math.random() * variability - variability/2)),
        impulse_score: Math.min(100, Math.max(0, baseScore + Math.random() * variability - variability/2)),
        attention_details: {
          overall_score: 0,
          percentile: 0,
          classification: '',
          components: {
            crop_score: 0,
            sequence_score: Math.floor(Math.random() * 1000)
          },
          data_completeness: 0
        },
        memory_details: {
          overall_score: 0,
          percentile: 0,
          classification: '',
          components: {
            working_memory: {
              score: Math.floor(Math.random() * 1000),
              components: {}
            },
            visual_memory: {
              score: 0,
              components: {}
            }
          },
          data_completeness: 0,
          tasks_used: []
        },
        executive_details: {
          overall_score: 0,
          percentile: 0,
          classification: '',
          components: {
            memory_contribution: Math.floor(Math.random() * 1000),
            impulse_contribution: 0,
            attention_contribution: 0
          },
          profile_pattern: '',
          data_completeness: 0
        },
        impulse_details: {
          overall_score: 0,
          percentile: 0,
          classification: '',
          components: {
            inhibitory_control: Math.floor(Math.random() * 1000),
            response_control: 0,
            decision_speed: 0,
            error_adaptation: 0
          },
          data_completeness: 0,
          games_used: []
        }
      });
    }
    
    return trendData;
  };
  
  const handlePatientChange = (id: string) => {
    navigate(`/analysis?patient=${id}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  // Find the current patient
  const currentPatient = patients.find(p => p.id === patientId);
  
  if (!currentPatient) {
    return <div className="p-8 pixel-text">Loading patient data...</div>;
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
      
      {/* Patient Analysis Component */}
      <PatientAnalysis 
        trendGraph={trendData}
        hasTrendData={trendData.length > 0}
        patientId={patientId || undefined}
      />
    </div>
  );
};

export default Analysis;
