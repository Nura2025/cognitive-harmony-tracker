import { formatDistance, parseISO } from 'date-fns';

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
