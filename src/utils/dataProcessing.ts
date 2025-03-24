// Add this to the top of the file, keeping any other imports
import { format, formatDistance, parseISO } from 'date-fns';
import { Activity, Patient, Session, PatientMetrics, CognitiveDomain } from '@/types/databaseTypes';

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

// Process session data for timeline visualization with null/undefined checks
export const processSessionsForTimeline = (sessions: Session[]): any[] => {
  if (!sessions || !Array.isArray(sessions)) {
    console.warn("Invalid sessions data provided to processSessionsForTimeline:", sessions);
    return [];
  }
  
  return sessions.map(session => {
    // Add strong null checks for date values
    const startTime = session.start_time || null;
    let formattedDate = 'Unknown';
    let formattedTime = 'Unknown';
    
    try {
      if (startTime) {
        formattedDate = format(parseISO(startTime), 'yyyy-MM-dd');
        formattedTime = format(parseISO(startTime), 'h:mm a');
      }
    } catch (error) {
      console.error("Error parsing date:", startTime, error);
    }
    
    // Calculate average score with fallbacks for missing values
    const attention = session.attention || 0;
    const memory = session.memory || 0;
    const executiveFunction = session.executive_function || 0;
    const behavioral = session.behavioral || 0;
    const averageScore = Math.round((attention + memory + executiveFunction + behavioral) / 4);
    
    return {
      id: session.id,
      patientId: session.patient_id,
      date: formattedDate,
      time: formattedTime,
      duration: session.duration || 0,
      score: averageScore,
      environment: session.environment || 'Unknown'
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

// Get friendly domain name for display
export const getDomainName = (domain: keyof CognitiveDomain): string => {
  switch (domain) {
    case 'attention':
      return 'Attention';
    case 'memory':
      return 'Memory';
    case 'executive_function':
      return 'Executive Function';
    case 'behavioral':
      return 'Behavioral Control';
    default:
      return 'Unknown Domain';
  }
};

// Get domain color for UI elements
export const getDomainColor = (domain: string): string => {
  switch (domain) {
    case 'attention':
      return 'text-blue-600';
    case 'memory':
      return 'text-purple-600';
    case 'executive_function':
      return 'text-amber-600';
    case 'behavioral':
      return 'text-emerald-600';
    default:
      return 'text-gray-600';
  }
};

// Get domain background color for UI elements
export const getDomainBgColor = (domain: string): string => {
  switch (domain) {
    case 'attention':
      return 'bg-blue-50';
    case 'memory':
      return 'bg-purple-50';
    case 'executive_function':
      return 'bg-amber-50';
    case 'behavioral':
      return 'bg-emerald-50';
    default:
      return 'bg-gray-50';
  }
};

// Format last session date for display
export const formatLastSession = (date?: string): string => {
  if (!date) return 'No sessions yet';
  try {
    return formatDistance(parseISO(date), new Date(), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid date';
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

// Map session from database format to application format
export const mapSessionFromDB = (dbSession: any): Session => {
  if (!dbSession) return null as unknown as Session;
  
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
    activities: dbSession.activities || [],
    created_at: dbSession.created_at
  };
};
