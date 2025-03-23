
import { formatDistance, parseISO } from 'date-fns';
import { CognitiveDomain } from '@/types/databaseTypes';
import { SessionData } from '@/utils/types/patientTypes';

// Function to determine the background color class based on the score
export const getScoreBgClass = (score: number): string => {
  if (score >= 80) {
    return 'bg-green-100';
  } else if (score >= 60) {
    return 'bg-yellow-100';
  } else {
    return 'bg-red-100';
  }
};

// Function to determine the text color class based on the score
export const getScoreColorClass = (score: number): string => {
  if (score >= 80) {
    return 'text-green-500';
  } else if (score >= 60) {
    return 'text-yellow-500';
  } else {
    return 'text-red-500';
  }
};

// Function to format a percentile value
export const formatPercentile = (percentile: number | null): string => {
  if (percentile === null || percentile === undefined) {
    return 'N/A';
  }
  return `${Math.round(percentile)}th`;
};

// Function to format duration from minutes to a human-readable format
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  } else {
    return `${remainingMinutes}m`;
  }
};

// Format a date to show how long ago it was (e.g., "2 days ago")
export const formatDateDistance = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

// Format a date to show how long ago it was (e.g., "2 days ago") or "Never" if null
export const formatLastSession = (dateString: string | null) => {
  if (!dateString) return 'Never';
  return formatDateDistance(dateString);
};

// Get the user-friendly name of a cognitive domain
export const getDomainName = (domain: keyof CognitiveDomain): string => {
  const domainNames: Record<keyof CognitiveDomain, string> = {
    attention: 'Attention',
    memory: 'Memory',
    executiveFunction: 'Executive Function',
    behavioral: 'Behavioral Control'
  };
  
  return domainNames[domain] || 'Unknown Domain';
};

// Get the background color class for a domain
export const getDomainBgColor = (domain: keyof CognitiveDomain): string => {
  const bgColors: Record<keyof CognitiveDomain, string> = {
    attention: 'bg-blue-50',
    memory: 'bg-purple-50',
    executiveFunction: 'bg-amber-50',
    behavioral: 'bg-emerald-50'
  };
  
  return bgColors[domain] || 'bg-gray-50';
};

// Get the text color class for a domain
export const getDomainColor = (domain: keyof CognitiveDomain): string => {
  const colors: Record<keyof CognitiveDomain, string> = {
    attention: 'text-blue-600',
    memory: 'text-purple-600',
    executiveFunction: 'text-amber-600',
    behavioral: 'text-emerald-600'
  };
  
  return colors[domain] || 'text-gray-600';
};

// Get a descriptive status for a score
export const getScoreStatus = (score: number): string => {
  if (score >= 80) {
    return 'Excellent';
  } else if (score >= 60) {
    return 'Good';
  } else if (score >= 40) {
    return 'Needs Improvement';
  } else {
    return 'Concerning';
  }
};

// Process sessions for timeline chart
export const processSessionsForTimeline = (sessions: SessionData[]): Array<{date: string; score: number}> => {
  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  
  // Map to the format needed for the chart
  return sortedSessions.map(session => {
    // Format date as YYYY-MM-DD for the chart
    const date = new Date(session.startTime).toISOString().split('T')[0];
    
    return {
      date,
      score: session.overallScore
    };
  });
};

// Data type mapping functions for database types
export const mapPatientFromDB = (dbPatient: any): any => {
  if (!dbPatient) return null;
  
  return {
    ...dbPatient,
    // Ensure gender is one of the allowed values
    gender: ['Male', 'Female', 'Other'].includes(dbPatient.gender) 
      ? dbPatient.gender as 'Male' | 'Female' | 'Other'
      : 'Other',
    // Ensure adhd_subtype is one of the allowed values
    adhd_subtype: ['Inattentive', 'Hyperactive-Impulsive', 'Combined'].includes(dbPatient.adhd_subtype)
      ? dbPatient.adhd_subtype as 'Inattentive' | 'Hyperactive-Impulsive' | 'Combined'
      : 'Combined'
  };
};

export const mapSessionFromDB = (dbSession: any): any => {
  if (!dbSession) return null;
  
  return {
    ...dbSession,
    // Ensure environment is one of the allowed values
    environment: ['Home', 'School', 'Clinic'].includes(dbSession.environment)
      ? dbSession.environment as 'Home' | 'School' | 'Clinic'
      : 'Home',
    // Ensure completion_status is one of the allowed values
    completion_status: ['Completed', 'Abandoned', 'Interrupted'].includes(dbSession.completion_status)
      ? dbSession.completion_status as 'Completed' | 'Abandoned' | 'Interrupted'
      : 'Completed'
  };
};
