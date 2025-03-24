
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Patient, PatientMetrics, Session, CognitiveDomain } from '@/types/databaseTypes';
import { 
  generateTrendData, 
  generateRecommendations, 
  generatePercentileData 
} from '@/utils/mockData';

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
        // Fetch patient data
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
        
        if (patientError) throw patientError;
        setPatient(patientData as Patient);
        
        // Fetch patient metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('patient_metrics')
          .select('*')
          .eq('patient_id', patientId)
          .order('date', { ascending: false })
          .limit(1)
          .single();
        
        if (metricsError && metricsError.code !== 'PGRST116') {
          throw metricsError;
        }
        
        setMetrics(metricsData as PatientMetrics || null);
        
        // Fetch sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('*, activities(*)')
          .eq('patient_id', patientId)
          .order('start_time', { ascending: true });
        
        if (sessionsError) throw sessionsError;
        setSessions(sessionsData as Session[] || []);
        
        // Generate recommendations based on patient data
        const subtypeValue = patientData?.adhd_subtype || 'Combined';
        const generatedRecommendations = generateRecommendations(subtypeValue);
        setRecommendations(generatedRecommendations);
        
        // Generate percentile data
        if (metricsData) {
          const generatedPercentileData = generatePercentileData(metricsData);
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
