import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface CognitiveProfile {
  user_id: string;
  user_name: string;
  age: number;
  age_group: string;
  adhd_subtype: string;
  session_id: string;
  session_date: string;
  domain_scores: Record<string, number>;
  percentiles: Record<string, number>;
  classifications: Record<string, string>;
  profile_pattern: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  score: number;
}

export interface ProgressComparison {
  user_id: string;
  domain: string;
  period: string;
  initial_score: number;
  current_score: number;
  initial_date: string;
  current_date: string;
  absolute_change: number;
  percentage_change: number;
}

export interface ComponentDetails {
  session_id: string;
  domain: string;
  overall_score: number;
  percentile: number;
  classification: string;
  components: Record<string, any>;
  data_completeness: number;
}

export interface NormativeComparison {
  user_id: string;
  domain: string;
  age_group: string;
  raw_score: number;
  normative_comparison: {
    mean: number;
    standard_deviation: number;
    z_score: number;
    percentile: number;
    reference: string;
    sample_size: number;
  };
  adhd_comparison: {
    z_score: number;
    percentile: number;
    reference: string;
  };
}

// Import mock data
import { mockNormativeData, mockSubtypeData, mockPatientData } from '../utils/mockData';

async function fetchCognitiveProfile(userId: string): Promise<CognitiveProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/cognitive/profile/883faae2-f14b-40de-be5a-ad4c3ec673bc`);
    if (!response.ok) {
      throw new Error('Failed to fetch cognitive profile');
    }
    return response.json();
  } catch (error) {
    // Return mock data on error
    return {
      user_id: mockPatientData.id,
      user_name: mockPatientData.name,
      age: mockPatientData.age,
      age_group: '12-17',
      adhd_subtype: mockPatientData.adhdSubtype,
      session_id: 'mock-session-1',
      session_date: new Date().toISOString(),
      domain_scores: mockNormativeData,
      percentiles: {
        attention: 75,
        memory: 80,
        impulse_control: 65,
        executive_function: 70
      },
      classifications: {
        attention: 'Above Average',
        memory: 'High',
        impulse_control: 'Average',
        executive_function: 'Above Average'
      },
      profile_pattern: 'Combined Type'
    };
  }
}

async function fetchTimeSeriesData(userId: string, domain: string, interval?: string): Promise<TimeSeriesDataPoint[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cognitive/timeseries/883faae2-f14b-40de-be5a-ad4c3ec673bc?domain=${domain}&${new URLSearchParams(interval ? { interval } : {})}`);
    if (!response.ok) {
      throw new Error('Failed to fetch time series data');
    }
    return response.json();
  } catch (error) {
    // Return mock time series data
    return Array.from({ length: 5 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: Math.floor(Math.random() * 30) + 70
    }));
  }
}

async function fetchProgressComparison(userId: string, domain: string, period: string): Promise<ProgressComparison> {
  try {
    const response = await fetch(`${API_BASE_URL}/cognitive/progress/883faae2-f14b-40de-be5a-ad4c3ec673bc?domain=${domain}&period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch progress comparison');
    return response.json();
  } catch (error) {
    // Return mock progress comparison data
    const initialScore = Math.floor(Math.random() * 20) + 60;
    const currentScore = Math.floor(Math.random() * 20) + 70;
    return {
      user_id: mockPatientData.id,
      domain,
      period,
      initial_score: initialScore,
      current_score: currentScore,
      initial_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      current_date: new Date().toISOString().split('T')[0],
      absolute_change: currentScore - initialScore,
      percentage_change: ((currentScore - initialScore) / initialScore) * 100
    };
  }
}

async function fetchComponentDetails(sessionId: string, domain: string): Promise<ComponentDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/cognitive/component-details/${sessionId}?domain=${domain}`);
    if (!response.ok) throw new Error('Failed to fetch component details');
    return response.json();
  } catch (error) {
    // Return mock component details
    return {
      session_id: sessionId,
      domain,
      overall_score: Math.floor(Math.random() * 20) + 70,
      percentile: Math.floor(Math.random() * 20) + 70,
      classification: 'Above Average',
      components: {
        accuracy: Math.floor(Math.random() * 20) + 70,
        speed: Math.floor(Math.random() * 20) + 70,
        consistency: Math.floor(Math.random() * 20) + 70
      },
      data_completeness: 100
    };
  }
}

async function fetchNormativeComparison(userId: string, domain: string): Promise<NormativeComparison> {
  try {
    const response = await fetch(`${API_BASE_URL}/cognitive/normative-comparison/883faae2-f14b-40de-be5a-ad4c3ec673bc?domain=${domain}`);
    if (!response.ok) throw new Error('Failed to fetch normative comparison');
    return response.json();
  } catch (error) {
    // Return mock normative comparison data
    return {
      user_id: userId,
      domain,
      age_group: '12-17',
      raw_score: Math.floor(Math.random() * 20) + 70,
      normative_comparison: {
        mean: 75,
        standard_deviation: 10,
        z_score: 0.8,
        percentile: 80,
        reference: 'Age-matched normative sample',
        sample_size: 1000
      },
      adhd_comparison: {
        z_score: 1.2,
        percentile: 85,
        reference: 'ADHD population sample'
      }
    };
  }
}

export function useCognitiveProfile(userId: string) {
  return useQuery({
    queryKey: ['cognitiveProfile', userId],
    queryFn: () => fetchCognitiveProfile(userId),
    meta: {
      errorMessage: 'Failed to fetch cognitive profile'
    }
  });
}

export function useTimeSeriesData(userId: string, domain: string, interval?: string) {
  return useQuery({
    queryKey: ['timeSeriesData', userId, domain, interval],
    queryFn: () => fetchTimeSeriesData(userId, domain, interval),
    meta: {
      onError: (error: Error) => {
        toast.error(error.message);
      }
    }
  });
}

export function useProgressComparison(userId: string, domain: string, period: string) {
  return useQuery({
    queryKey: ['progressComparison', userId, domain, period],
    queryFn: () => fetchProgressComparison(userId, domain, period)
  });
}

export function useComponentDetails(sessionId: string, domain: string) {
  return useQuery({
    queryKey: ['componentDetails', sessionId, domain],
    queryFn: () => fetchComponentDetails(sessionId, domain)
  });
}

export function useNormativeComparison(userId: string, domain: string) {
  return useQuery({
    queryKey: ['normativeComparison', userId, domain],
    queryFn: () => fetchNormativeComparison(userId, domain)
  });
}
