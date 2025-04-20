
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API base URL

// Types for API responses
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

// Fetch functions
async function fetchCognitiveProfile(userId: string): Promise<CognitiveProfile> {
  const response = await fetch(`${API_BASE_URL}/cognitive/profile/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch cognitive profile');
  return response.json();
}

async function fetchTimeSeriesData(userId: string, domain: string, interval?: string): Promise<TimeSeriesDataPoint[]> {
  const params = new URLSearchParams(interval ? { interval } : {});
  const response = await fetch(`${API_BASE_URL}/cognitive/timeseries/${userId}?domain=${domain}&${params}`);
  if (!response.ok) throw new Error('Failed to fetch time series data');
  return response.json();
}

async function fetchProgressComparison(userId: string, domain: string, period: string): Promise<ProgressComparison> {
  const response = await fetch(`${API_BASE_URL}/cognitive/progress/${userId}?domain=${domain}&period=${period}`);
  if (!response.ok) throw new Error('Failed to fetch progress comparison');
  return response.json();
}

async function fetchComponentDetails(sessionId: string, domain: string): Promise<ComponentDetails> {
  const response = await fetch(`${API_BASE_URL}/cognitive/component-details/${sessionId}?domain=${domain}`);
  if (!response.ok) throw new Error('Failed to fetch component details');
  return response.json();
}

async function fetchNormativeComparison(userId: string, domain: string): Promise<NormativeComparison> {
  const response = await fetch(`${API_BASE_URL}/cognitive/normative-comparison/${userId}?domain=${domain}`);
  if (!response.ok) throw new Error('Failed to fetch normative comparison');
  return response.json();
}

// React Query hooks
export function useCognitiveProfile(userId: string) {
  return useQuery({
    queryKey: ['cognitiveProfile', userId],
    queryFn: () => fetchCognitiveProfile(userId)
  });
}

export function useTimeSeriesData(userId: string, domain: string, interval?: string) {
  return useQuery({
    queryKey: ['timeSeriesData', userId, domain, interval],
    queryFn: () => fetchTimeSeriesData(userId, domain, interval)
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
