
import { format, formatDistance, parseISO } from 'date-fns';
import { SessionData } from './types/patientTypes';

// Format a date string to a human-readable format
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    console.error('Invalid date format:', dateString);
    return 'Invalid date';
  }
};

// Format a date string to show how long ago
export const formatLastSession = (dateString: string): string => {
  try {
    return formatDistance(parseISO(dateString), new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Invalid date format:', dateString);
    return 'Invalid date';
  }
};

// Format a duration in seconds to a human-readable format
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0m';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (minutes < 1) {
    return `${remainingSeconds}s`;
  } else if (remainingSeconds === 0) {
    return `${minutes}m`;
  } else {
    return `${minutes}m ${remainingSeconds}s`;
  }
};

// Get CSS class based on score
export const getScoreColorClass = (score: number): string => {
  if (score < 40) return 'text-red-500';
  if (score < 60) return 'text-amber-500';
  if (score < 80) return 'text-emerald-500';
  return 'text-blue-500';
};

// Get background CSS class based on score
export const getScoreBgClass = (score: number): string => {
  if (score < 40) return 'bg-red-100 text-red-800';
  if (score < 60) return 'bg-amber-100 text-amber-800';
  if (score < 80) return 'bg-emerald-100 text-emerald-800';
  return 'bg-blue-100 text-blue-800';
};

// Format percentile with + symbol if above threshold
export const formatPercentile = (percentile: number | undefined): string => {
  if (percentile === undefined || isNaN(Number(percentile))) return '0th';
  return `${percentile}${getPercentileSuffix(percentile)}`;
};

// Get the suffix for a percentile number (1st, 2nd, 3rd, etc.)
export const getPercentileSuffix = (num: number): string => {
  if (num === 11 || num === 12 || num === 13) return 'th';
  
  const lastDigit = num % 10;
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

// Process sessions for timeline display
export const processSessionsForTimeline = (sessions: SessionData[]) => {
  return sessions.map(session => {
    // Convert session data to format needed for timeline
    return {
      date: format(parseISO(session.startTime), 'yyyy-MM-dd'),
      score: session.overallScore,
      duration: session.duration || 0
    };
  }).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

// Convert a string key to a human-readable label
export const formatKeyToLabel = (key: string): string => {
  // Handle special cases
  switch (key) {
    case 'executiveFunction':
      return 'Executive Function';
    case 'impulseControl':
      return 'Impulse Control';
    default:
      // Convert camelCase to space-separated words
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
  }
};
