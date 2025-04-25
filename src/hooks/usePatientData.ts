
import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://preview--cognitive-harmony-tracker.lovable.app';

async function fetchPatientData(patientId: string) {
  const response = await fetch(`${API_URL}/patient/${patientId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch patient data');
  }
  return response.json();
}

export function usePatientData(patientId: string) {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => fetchPatientData(patientId),
    retry: 2
  });
}
