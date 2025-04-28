
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientService from '@/services/patient';
import { useToast } from '@/components/ui/use-toast';

export const usePatientData = (patientId: string | undefined) => {
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [patientTrends, setPatientTrends] = useState<any>(null);
  const [patientSessions, setPatientSessions] = useState<any>([]);
  const [patientMetrics, setPatientMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        navigate("/patients");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all data concurrently for better performance
        const [profileRes, trendsRes, sessionsRes, metricsRes] = await Promise.all([
          PatientService.getPatientProfile(patientId),
          PatientService.getPatientTrendData(patientId).catch(() => ({ data: null })),
          PatientService.getPatientSessions(patientId).catch(() => ({ data: [] })),
          PatientService.getPatientMetrics(patientId).catch(() => ({ data: null }))
        ]);
        
        setPatientProfile(profileRes.data);
        setPatientTrends(trendsRes.data);
        setPatientSessions(sessionsRes.data);
        setPatientMetrics(metricsRes.data);
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
        setError("Failed to fetch patient data. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load patient data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, navigate, toast]);
  
  return {
    patientProfile,
    patientTrends,
    patientSessions,
    patientMetrics,
    loading,
    error,
  };
};
