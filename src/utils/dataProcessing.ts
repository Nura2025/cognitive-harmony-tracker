// Domain styling utilities
export const getDomainColor = (domain: string): string => {
  const colors: Record<string, string> = {
    attention: 'text-blue-600',
    memory: 'text-green-600',
    executiveFunction: 'text-amber-600',
    impulseControl: 'text-purple-600',
    behavioral: 'text-rose-600'
  };
  return colors[domain] || 'text-gray-600';
};

export const getDomainBgColor = (domain: string): string => {
  const colors: Record<string, string> = {
    attention: 'bg-blue-50',
    memory: 'bg-green-50',
    executiveFunction: 'bg-amber-50',
    impulseControl: 'bg-purple-50',
    behavioral: 'bg-rose-50'
  };
  return colors[domain] || 'bg-gray-50';
};

export const getDomainName = (domain: string): string => {
  const names: Record<string, string> = {
    attention: 'Attention',
    memory: 'Memory',
    executiveFunction: 'Executive Function',
    impulseControl: 'Impulse Control',
    behavioral: 'Behavioral'
  };
  return names[domain] || domain;
};

export const getScoreStatus = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Below Average';
  return 'Needs Improvement';
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatLastSession = (date: string): string => {
  const sessionDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - sessionDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return sessionDate.toLocaleDateString();
};

export const getScoreColorClass = (score: number): string => {
  if (score >= 90) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
};

export const formatPercentile = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A';
  return `${Math.round(value)}`;
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 90) return 'bg-emerald-100';
  if (score >= 70) return 'bg-blue-100';
  if (score >= 50) return 'bg-amber-100';
  return 'bg-red-100';
};

export const getScoreBgClass = (score: number): string => {
  if (score >= 90) return 'bg-emerald-500/10';
  if (score >= 70) return 'bg-blue-500/10';
  if (score >= 50) return 'bg-amber-500/10';
  return 'bg-red-500/10';
};

// Timeline processing
export const processSessionsForTimeline = (sessions: any[]): any[] => {
  return sessions.map(session => ({
    id: session.id,
    date: new Date(session.startTime),
    title: 'Cognitive Assessment',
    description: `Overall Score: ${session.overallScore}%`,
    duration: session.duration || 30
  }));
};
