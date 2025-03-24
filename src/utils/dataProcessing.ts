// Add this to the top of the file, keeping any other imports
import { format, formatDistance, parseISO } from 'date-fns';
import { Patient, Session, PatientMetrics } from '@/types/databaseTypes';

// Format percentile for display
export const formatPercentile = (percentile?: number | null): string => {
  if (percentile === undefined || percentile === null) return '0';
  return percentile.toString();
};

// Get CSS color class based on score
export const getScoreColorClass = (score?: number | null): string => {
  if (score === undefined || score === null) score = 0;
  if (score < 50) return 'text-red-500';
  if (score < 70) return 'text-yellow-500';
  if (score < 85) return 'text-blue-500';
  return 'text-green-500';
};

// Format date as relative time
export const formatDateDistance = (date?: string): string => {
  if (!date) return 'N/A';
  try {
    return formatDistance(parseISO(date), new Date(), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid date';
  }
};

// Format session duration from minutes to readable format
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hr${hours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
};

// Process session data for timeline visualization
export const processSessionsForTimeline = (sessions: Session[]): any[] => {
  return sessions.map(session => {
    return {
      id: session.id,
      patientId: session.patient_id,
      date: format(parseISO(session.start_time), 'MMM d, yyyy'),
      time: format(parseISO(session.start_time), 'h:mm a'),
      duration: session.duration,
      score: Math.round((session.attention + session.memory + session.executive_function + session.behavioral) / 4),
      environment: session.environment
    };
  });
};

// Get background class based on score for visualization
export const getScoreBgClass = (score: number): string => {
  if (score < 50) return 'bg-red-100 text-red-800';
  if (score < 70) return 'bg-yellow-100 text-yellow-800';
  if (score < 85) return 'bg-blue-100 text-blue-800';
  return 'bg-green-100 text-green-800';
};

// Get score status label
export const getScoreStatus = (score: number): string => {
  if (score < 50) return 'Needs Attention';
  if (score < 70) return 'Developing';
  if (score < 85) return 'Proficient';
  return 'Advanced';
};

// Map database field names to UI-friendly format
export const convertToDatabaseKey = (key: string): string => {
  switch (key) {
    case 'executiveFunction':
      return 'executive_function';
    default:
      return key;
  }
};

// Map patient from database format to application format
export const mapPatientFromDB = (dbPatient: any): Patient => {
  if (!dbPatient) return null as unknown as Patient;
  
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
