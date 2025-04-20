
import { CognitiveDomain } from './types/patientTypes';

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

// Get score background color based on value
export const getScoreBgClass = (score: number): string => {
  if (score >= 80) return 'bg-emerald-50';
  if (score >= 60) return 'bg-blue-50';
  if (score >= 40) return 'bg-amber-50';
  return 'bg-red-50';
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

// Format last session date
export const formatLastSession = (date: string): string => {
  if (!date) return 'N/A';
  
  const sessionDate = new Date(date);
  const now = new Date();
  
  // Calculate time difference
  const diffTime = Math.abs(now.getTime() - sessionDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
};

// Format duration in seconds to a readable format
export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0m 0s';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  } else if (remainingSeconds === 0) {
    return `${minutes}m`;
  } else {
    return `${minutes}m ${remainingSeconds}s`;
  }
};

// Process sessions data for timeline visualization
export const processSessionsForTimeline = (sessions: any[]): { date: string; score: number }[] => {
  if (!sessions || !Array.isArray(sessions)) {
    return [];
  }

  return sessions.map(session => {
    // Handle different data formats
    const date = session.date || (session.startTime ? new Date(session.startTime).toISOString().split('T')[0] : '');
    const score = typeof session.score === 'number' ? session.score : 
                 (typeof session.overallScore === 'number' ? session.overallScore : 0);
    
    return {
      date,
      score
    };
  });
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

// For score badges
export const getScoreBadgeVariant = (score: number): "default" | "destructive" | "outline" | "secondary" => {
  if (score < 40) return "destructive";
  if (score < 60) return "outline";
  if (score < 85) return "secondary";
  return "default";
};
