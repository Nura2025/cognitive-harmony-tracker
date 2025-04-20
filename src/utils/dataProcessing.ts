
import { CognitiveDomain } from './types/patientTypes';
import { mockNormativeData, mockSubtypeData } from './mockData';

// Get domain display name
export const getDomainName = (domain: string): string => {
  const domainMap: Record<string, string> = {
    'attention': 'Attention',
    'memory': 'Memory',
    'executiveFunction': 'Executive Function',
    'impulseControl': 'Impulse Control',
    'behavioral': 'Behavioral',
    'executive_function': 'Executive Function',
    'impulse_control': 'Impulse Control'
  };
  
  return domainMap[domain] || String(domain);
};

// Get domain color for styling
export const getDomainColor = (domain: string): string => {
  const colorMap: Record<string, string> = {
    'attention': 'text-blue-600',
    'memory': 'text-amber-600',
    'executiveFunction': 'text-emerald-600',
    'behavioral': 'text-violet-600',
    'impulseControl': 'text-rose-600'
  };
  
  return colorMap[domain] || 'text-gray-600';
};

// Get domain background color for styling
export const getDomainBgColor = (domain: string): string => {
  const bgColorMap: Record<string, string> = {
    'attention': 'bg-blue-50',
    'memory': 'bg-amber-50',
    'executiveFunction': 'bg-emerald-50',
    'behavioral': 'bg-violet-50',
    'impulseControl': 'bg-rose-50'
  };
  
  return bgColorMap[domain] || 'bg-gray-50';
};

// Get score color based on value
export const getScoreColorClass = (score: number): string => {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-600';
};

// Get status text based on score
export const getScoreStatus = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
};

// Format percentile display
export const formatPercentile = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A';
  return `${Math.round(value)}`;
};

// Helper function to convert string object keys to camelCase
export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
};

// Convert cognitive profile object from snake_case to camelCase
export const formatCognitiveProfile = (profile: Record<string, any>): Record<string, any> => {
  const formattedProfile: Record<string, any> = {};
  
  for (const key in profile) {
    const camelKey = toCamelCase(key);
    
    if (typeof profile[key] === 'object' && profile[key] !== null) {
      formattedProfile[camelKey] = formatCognitiveProfile(profile[key]);
    } else {
      formattedProfile[camelKey] = profile[key];
    }
  }
  
  return formattedProfile;
};

// Get domain key from display name
export const getDomainKey = (displayName: string): string => {
  const lowerCaseName = String(displayName).toLowerCase();
  
  if (lowerCaseName.includes('attention')) return 'attention';
  if (lowerCaseName.includes('memory')) return 'memory';
  if (lowerCaseName.includes('executive')) return 'executiveFunction';
  if (lowerCaseName.includes('impulse')) return 'impulseControl';
  if (lowerCaseName.includes('behavior')) return 'behavioral';
  
  return String(displayName);
};

// Calculate overall improvement from sessions
export const calculateImprovement = (sessions: any[]): number => {
  if (!sessions || sessions.length < 2) {
    return 0;
  }
  
  const firstSession = sessions[0];
  const lastSession = sessions[sessions.length - 1];
  
  if (!firstSession || !lastSession || 
      typeof firstSession.score !== 'number' || 
      typeof lastSession.score !== 'number') {
    return 0;
  }
  
  return Math.round((lastSession.score - firstSession.score) * 10) / 10;
};
