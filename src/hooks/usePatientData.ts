
import { useQuery } from '@tanstack/react-query';

const API_URL = 'https://preview--cognitive-harmony-tracker.lovable.app';

async function fetchPatientData(patientId: string) {
  const response = await fetch(`http://127.0.0.1:8000/api/cognitive/profile/883faae2-f14b-40de-be5a-ad4c3ec673bc
`);
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
