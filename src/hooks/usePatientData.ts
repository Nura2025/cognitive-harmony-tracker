
import { useQuery } from '@tanstack/react-query';
import PatientService from '@/services/patient';
import { useToast } from '@/components/ui/use-toast';

export const usePatientData = (patientId: string | undefined) => {
  const { toast } = useToast();

  const fetchPatientProfile = async () => {
    if (!patientId) throw new Error('Patient ID is required');
    const response = await PatientService.getPatientProfile(patientId);
    return response.data;
  };

  const fetchPatientTrends = async () => {
    if (!patientId) return null;
    const response = await PatientService.getPatientTrendData(patientId);
    return response.data;
  };

  const fetchPatientSessions = async () => {
    if (!patientId) return [];
    const response = await PatientService.getPatientSessions(patientId);
    return response.data;
  };

  const fetchPatientMetrics = async () => {
    if (!patientId) return null;
    const response = await PatientService.getPatientMetrics(patientId);
    return response.data;
  };

  const profileQuery = useQuery({
    queryKey: ['patientProfile', patientId],
    queryFn: fetchPatientProfile,
    enabled: !!patientId,
    onError: (error) => {
      console.error('Failed to fetch patient profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load patient profile data.",
      });
    }
  });

  const trendsQuery = useQuery({
    queryKey: ['patientTrends', patientId],
    queryFn: fetchPatientTrends,
    enabled: !!patientId,
    onError: (error) => {
      console.error('Failed to fetch patient trends:', error);
    }
  });

  const sessionsQuery = useQuery({
    queryKey: ['patientSessions', patientId],
    queryFn: fetchPatientSessions,
    enabled: !!patientId,
    onError: (error) => {
      console.error('Failed to fetch patient sessions:', error);
    }
  });

  const metricsQuery = useQuery({
    queryKey: ['patientMetrics', patientId],
    queryFn: fetchPatientMetrics,
    enabled: !!patientId,
    onError: (error) => {
      console.error('Failed to fetch patient metrics:', error);
    }
  });

  return {
    patientProfile: profileQuery.data,
    patientTrends: trendsQuery.data,
    patientSessions: sessionsQuery.data,
    patientMetrics: metricsQuery.data,
    loading: profileQuery.isPending || trendsQuery.isPending || sessionsQuery.isPending || metricsQuery.isPending,
    error: profileQuery.error || trendsQuery.error || sessionsQuery.error || metricsQuery.error,
  };
};
