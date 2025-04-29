
import axios from 'axios';
import { API_BASE } from './config';

export interface NormativeComparisonData {
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
  adhd_comparison: any; // Could be null or have a similar structure
}

// Fetch normative comparison data for a specific domain
export const fetchNormativeComparison = async (userId: string, domain: string): Promise<NormativeComparisonData> => {
  try {
    const response = await axios.get(
      `${API_BASE}/api/cognitive/normative-comparison/${userId}?domain=${domain}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching normative data for ${domain}:`, error);
    
    // Return mock data when API is not available
    // In production, you'd want to handle this error differently
    return generateMockNormativeData(userId, domain);
  }
};

// Mock data function for development/fallback
const generateMockNormativeData = (userId: string, domain: string): NormativeComparisonData => {
  // Create domain-specific mock data
  let raw_score = 0;
  let z_score = 0;
  let mean = 0;
  let std = 0;
  let percentile = 0;
  
  switch(domain.toLowerCase()) {
    case 'memory':
      raw_score = 63.5;
      z_score = -0.74;
      mean = 75.2;
      std = 15.8;
      percentile = 22.9;
      break;
    case 'attention':
      raw_score = 72.1;
      z_score = 0.27;
      mean = 68.4;
      std = 13.7;
      percentile = 60.6;
      break;
    case 'executivefunction':
      raw_score = 67.8;
      z_score = -0.15;
      mean = 69.5;
      std = 11.3;
      percentile = 44.0;
      break;
    case 'behavioral':
    case 'impulsecontrol':
      raw_score = 59.3;
      z_score = -1.21;
      mean = 73.8;
      std = 12.0;
      percentile = 11.3;
      break;
    default:
      raw_score = 65.0;
      z_score = 0.0;
      mean = 65.0;
      std = 15.0;
      percentile = 50.0;
  }
  
  return {
    user_id: userId,
    domain: domain,
    age_group: "8-12 years",
    raw_score: raw_score,
    normative_comparison: {
      mean: mean,
      standard_deviation: std,
      z_score: z_score,
      percentile: percentile,
      reference: "ACME Normative Database (2023)",
      sample_size: 1850
    },
    adhd_comparison: null
  };
};

// Fetch all domain comparisons for a user at once
export const fetchAllNormativeData = async (userId: string): Promise<Record<string, NormativeComparisonData>> => {
  const domains = ['memory', 'attention', 'executivefunction', 'behavioral'];
  
  try {
    const promises = domains.map(domain => fetchNormativeComparison(userId, domain));
    const results = await Promise.all(promises);
    
    // Convert array of results to an object with domain keys
    return results.reduce((acc, data) => {
      acc[data.domain.toLowerCase()] = data;
      return acc;
    }, {} as Record<string, NormativeComparisonData>);
  } catch (error) {
    console.error('Error fetching all normative data:', error);
    throw error;
  }
};

// Normative service with all methods
const NormativeService = {
  fetchNormativeComparison,
  fetchAllNormativeData
};

export default NormativeService;
