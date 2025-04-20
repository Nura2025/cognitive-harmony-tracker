
import { format, subDays } from 'date-fns';
import { TimeSeriesDataPoint, CognitiveDomain } from '../types/patientTypes';

/**
 * Generate trend data for visualization
 * @param domain The cognitive domain to generate data for
 * @param days Number of days to generate data for
 */
export const generateTrendData = (domain: string, days: number = 30): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  
  for (let i = 0; i < days; i += Math.floor(Math.random() * 4 + 1)) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      score: Math.floor(Math.random() * 30) + 60, // Score between 60-90
      value: Math.floor(Math.random() * 30) + 60 // For backwards compatibility
    });
  }
  
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Generate percentile comparison data for visualization
 */
export const generatePercentileData = () => {
  return {
    ageGroup: {
      attention: Math.floor(Math.random() * 30) + 30,
      memory: Math.floor(Math.random() * 40) + 40,
      executiveFunction: Math.floor(Math.random() * 25) + 25,
      impulseControl: Math.floor(Math.random() * 20) + 20,
      behavioral: Math.floor(Math.random() * 35) + 35
    },
    adhdSubtype: {
      attention: Math.floor(Math.random() * 30) + 50,
      memory: Math.floor(Math.random() * 40) + 40,
      executiveFunction: Math.floor(Math.random() * 25) + 45,
      impulseControl: Math.floor(Math.random() * 20) + 40,
      behavioral: Math.floor(Math.random() * 35) + 35
    }
  };
};

/**
 * Generate test data for patient domain scores
 */
export const generateDomainScores = (): CognitiveDomain => {
  return {
    attention: Math.floor(Math.random() * 30) + 60,
    memory: Math.floor(Math.random() * 30) + 60,
    executiveFunction: Math.floor(Math.random() * 30) + 60,
    impulseControl: Math.floor(Math.random() * 30) + 60,
    behavioral: Math.floor(Math.random() * 30) + 60
  };
};
