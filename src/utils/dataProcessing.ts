
// Utility functions for data processing and formatting

import { formatDistanceToNow, format } from 'date-fns';
import { CognitiveDomain } from '@/types/databaseTypes';

// Format a date to show how long ago it was
export const formatDateDistance = (date: string): string => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
};

// Format a date for last session display
export const formatLastSession = (date: string | undefined): string => {
  if (!date) return 'No sessions';
  return formatDateDistance(date);
};

// Format a number as a percentile
export const formatPercentile = (percentile: number | null | undefined): string => {
  if (percentile === null || percentile === undefined) {
    return 'N/A';
  }
  return `${Math.round(percentile)}th`;
};

// Get a color class based on a score
export const getScoreColorClass = (score: number | null | undefined): string => {
  if (score === null || score === undefined) {
    return 'text-gray-500';
  }
  if (score >= 75) {
    return 'text-green-500';
  } else if (score >= 50) {
    return 'text-yellow-500';
  } else {
    return 'text-red-500';
  }
};

// Get a background color class based on a score
export const getScoreBgClass = (score: number | null | undefined): string => {
  if (score === null || score === undefined) {
    return 'bg-gray-100';
  }
  if (score >= 75) {
    return 'bg-green-50';
  } else if (score >= 50) {
    return 'bg-yellow-50';
  } else {
    return 'bg-red-50';
  }
};

// Get status text based on a score
export const getScoreStatus = (score: number | null | undefined): string => {
  if (score === null || score === undefined) {
    return 'Not Available';
  }
  if (score >= 75) {
    return 'Strong';
  } else if (score >= 50) {
    return 'Moderate';
  } else {
    return 'Needs Support';
  }
};

// Map snake_case domain keys to human-readable names
export const getDomainName = (domain: string): string => {
  const domainNames: Record<string, string> = {
    'attention': 'Attention',
    'memory': 'Memory',
    'executive_function': 'Executive Function',
    'behavioral': 'Behavioral Regulation'
  };
  
  return domainNames[domain] || domain;
};

// Convert camelCase keys to snake_case (for database)
export const convertToDatabaseKey = (key: string): string => {
  if (key === 'executiveFunction') return 'executive_function';
  return key;
};

// Get domain-specific background color
export const getDomainBgColor = (domain: string): string => {
  const colors: Record<string, string> = {
    'attention': 'bg-blue-100 dark:bg-blue-900/20',
    'memory': 'bg-green-100 dark:bg-green-900/20',
    'executive_function': 'bg-purple-100 dark:bg-purple-900/20',
    'behavioral': 'bg-orange-100 dark:bg-orange-900/20'
  };
  
  return colors[domain] || 'bg-gray-100 dark:bg-gray-800';
};

// Get domain-specific color
export const getDomainColor = (domain: string): string => {
  const colors: Record<string, string> = {
    'attention': 'text-blue-600 dark:text-blue-400',
    'memory': 'text-green-600 dark:text-green-400',
    'executive_function': 'text-purple-600 dark:text-purple-400',
    'behavioral': 'text-orange-600 dark:text-orange-400'
  };
  
  return colors[domain] || 'text-gray-600 dark:text-gray-400';
};

// Format session duration
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  } else if (remainingSeconds === 0) {
    return `${minutes}m`;
  } else {
    return `${minutes}m ${remainingSeconds}s`;
  }
};

// Process sessions data for timeline display
export const processSessionsForTimeline = (sessions: any[]): Array<{ date: string; score: number }> => {
  return sessions
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .map(session => ({
      date: format(new Date(session.startTime), 'yyyy-MM-dd'),
      score: session.overallScore
    }));
};

// Map database objects to client-side objects
export const mapPatientFromDB = (dbPatient: any): any => {
  if (!dbPatient) return null;
  
  return {
    id: dbPatient.id,
    name: dbPatient.name,
    age: dbPatient.age,
    gender: dbPatient.gender,
    diagnosis_date: dbPatient.diagnosis_date,
    adhd_subtype: dbPatient.adhd_subtype,
    created_at: dbPatient.created_at
  };
};

export const mapSessionFromDB = (dbSession: any): any => {
  if (!dbSession) return null;
  
  return {
    id: dbSession.id,
    patient_id: dbSession.patient_id,
    start_time: dbSession.start_time,
    end_time: dbSession.end_time,
    duration: dbSession.duration,
    environment: dbSession.environment,
    completion_status: dbSession.completion_status,
    overall_score: dbSession.overall_score,
    device: dbSession.device,
    attention: dbSession.attention,
    memory: dbSession.memory,
    executive_function: dbSession.executive_function,
    behavioral: dbSession.behavioral,
    domainScores: {
      attention: dbSession.attention,
      memory: dbSession.memory,
      executiveFunction: dbSession.executive_function,
      behavioral: dbSession.behavioral
    },
    activities: dbSession.activities || []
  };
};
