// Utility functions for data processing and formatting

import { formatDistanceToNow } from 'date-fns';

// Format a date to show how long ago it was
export const formatDateDistance = (date: string): string => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
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

// Map database objects to client-side objects
export const mapPatientFromDB = (dbPatient: any): any => {
  if (!dbPatient) return null;
  
  return {
    id: dbPatient.id,
    name: dbPatient.name,
    age: dbPatient.age,
    gender: dbPatient.gender,
    diagnosisDate: dbPatient.diagnosis_date,
    adhdSubtype: dbPatient.adhd_subtype,
    created_at: dbPatient.created_at
  };
};

export const mapSessionFromDB = (dbSession: any): any => {
  if (!dbSession) return null;
  
  return {
    id: dbSession.id,
    patientId: dbSession.patient_id,
    startTime: dbSession.start_time,
    endTime: dbSession.end_time,
    duration: dbSession.duration,
    environment: dbSession.environment,
    completionStatus: dbSession.completion_status,
    overallScore: dbSession.overall_score,
    device: dbSession.device,
    domainScores: {
      attention: dbSession.attention,
      memory: dbSession.memory,
      executiveFunction: dbSession.executive_function,
      behavioral: dbSession.behavioral
    },
    // Copy the original properties to maintain compatibility with database functions
    attention: dbSession.attention,
    memory: dbSession.memory,
    executive_function: dbSession.executive_function,
    behavioral: dbSession.behavioral,
    activities: dbSession.activities || []
  };
};
