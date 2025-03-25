
import { useState, useEffect } from 'react';
import { Patient, PatientMetrics, Session, CognitiveDomain } from '@/types/databaseTypes';
import { patientAPI, sessionAPI, patientMetricsAPI } from '@/api/apiClient';

export function usePatientAnalysis(patientId: string | null) {
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [metrics, setMetrics] = useState<PatientMetrics | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [percentileData, setPercentileData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Normative data for comparison (later this could come from the database)
  const mockNormativeData: CognitiveDomain = {
    attention: 65,
    memory: 70,
    executive_function: 68,
    behavioral: 72
  };

  // Subtype data for comparison (later this could come from the database)
  const mockSubtypeData: CognitiveDomain = {
    attention: 40,
    memory: 45,
    executive_function: 42,
    behavioral: 48
  };

  useEffect(() => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch patient data from FastAPI
        const patientData = await patientAPI.getById(patientId);
        setPatient(patientData as Patient);
        
        // Fetch patient metrics from FastAPI
        const metricsData = await patientMetricsAPI.getAll({ patient_id: patientId });
        // Assuming the API returns the most recent metrics first
        setMetrics(metricsData.length > 0 ? metricsData[0] as PatientMetrics : null);
        
        // Fetch sessions from FastAPI
        const sessionsData = await sessionAPI.getAll({ patient_id: patientId });
        setSessions(sessionsData as Session[] || []);
        
        // Generate recommendations based on patient data
        const subtypeValue = patientData?.adhd_subtype || 'Combined';
        
        // Import these functions dynamically to avoid type conflicts
        const { generateRecommendations, generatePercentileData, generateTrendData } = await import('@/utils/mockData');
        
        const generatedRecommendations = generateRecommendations(subtypeValue);
        setRecommendations(generatedRecommendations);
        
        // Generate percentile data
        if (metricsData.length > 0) {
          const generatedPercentileData = generatePercentileData(metricsData[0]);
          setPercentileData(generatedPercentileData);
        }
        
        // Generate trend data
        if (sessionsData && sessionsData.length > 0) {
          const generatedTrendData = generateTrendData(sessionsData);
          setTrendData(generatedTrendData);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching patient analysis data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [patientId]);
  
  return {
    isLoading,
    error,
    patient,
    metrics,
    sessions,
    recommendations,
    percentileData,
    trendData,
    normativeData: mockNormativeData,
    subtypeData: mockSubtypeData
  };
}
