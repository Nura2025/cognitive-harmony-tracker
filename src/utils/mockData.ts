
import { subDays, format, addMinutes, subMonths } from 'date-fns';

// Generate a random number between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

// Generate a random float between min and max with fixed decimal places
const randomFloat = (min: number, max: number, decimals: number = 2) => {
  const num = Math.random() * (max - min) + min;
  return parseFloat(num.toFixed(decimals));
};

// Random selection from an array
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Types for our mock data
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosisDate: string;
  adhdSubtype: 'Inattentive' | 'Hyperactive-Impulsive' | 'Combined';
  assessmentCount: number;
  lastAssessment: string;
}

export interface CognitiveDomain {
  attention: number;
  memory: number;
  executiveFunction: number;
  behavioral: number;
}

export interface PatientMetrics extends CognitiveDomain {
  patientId: string;
  date: string;
  percentile: number;
  sessionsDuration: number;
  sessionsCompleted: number;
  progress: number;
  clinicalConcerns: string[];
}

export interface SessionData {
  id: string;
  patientId: string;
  startTime: string;
  endTime: string;
  duration: number;
  environment: 'Home' | 'School' | 'Clinic';
  completionStatus: 'Completed' | 'Abandoned' | 'Interrupted';
  overallScore: number;
  device: string;
  activities: Array<{
    id: string;
    type: string;
    score: number;
    duration: number;
    difficulty: number;
  }>;
  domainScores: CognitiveDomain;
}

// Generate mock patients
export const generatePatients = (count: number = 10): Patient[] => {
  const subtypes: Array<'Inattentive' | 'Hyperactive-Impulsive' | 'Combined'> = ['Inattentive', 'Hyperactive-Impulsive', 'Combined'];
  const genders: Array<'Male' | 'Female' | 'Other'> = ['Male', 'Female', 'Other'];
  const firstNames = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Skyler', 'Morgan', 'Sam', 'Drew'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Martinez'];
  
  return Array.from({ length: count }, (_, i) => {
    const assessmentCount = randomInt(1, 15);
    const lastAssessmentDays = randomInt(1, 30);
    
    return {
      id: `P${1000 + i}`,
      name: `${randomChoice(firstNames)} ${randomChoice(lastNames)}`,
      age: randomInt(6, 17),
      gender: randomChoice(genders),
      diagnosisDate: format(subMonths(new Date(), randomInt(1, 24)), 'yyyy-MM-dd'),
      adhdSubtype: randomChoice(subtypes),
      assessmentCount,
      lastAssessment: format(subDays(new Date(), lastAssessmentDays), 'yyyy-MM-dd')
    };
  });
};

// Generate metrics for each patient
export const generatePatientMetrics = (patients: Patient[]): PatientMetrics[] => {
  return patients.map(patient => {
    const concerns = [];
    const attention = randomFloat(40, 95);
    const memory = randomFloat(40, 95);
    const executiveFunction = randomFloat(40, 95);
    const behavioral = randomFloat(40, 95);
    
    // Add clinical concerns based on scores
    if (attention < 60) concerns.push('Low sustained attention');
    if (memory < 60) concerns.push('Memory retention difficulties');
    if (executiveFunction < 60) concerns.push('Poor planning abilities');
    if (behavioral < 60) concerns.push('High impulsivity');
    
    // Calculate average percentile
    const percentile = Math.round((attention + memory + executiveFunction + behavioral) / 4);
    
    return {
      patientId: patient.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      attention,
      memory,
      executiveFunction,
      behavioral,
      percentile,
      sessionsDuration: randomInt(20, 200),
      sessionsCompleted: patient.assessmentCount,
      progress: randomInt(5, 25),
      clinicalConcerns: concerns
    };
  });
};

// Generate session data for patients
export const generateSessionData = (patients: Patient[], sessionsPerPatient: number = 5): SessionData[] => {
  const environments: Array<'Home' | 'School' | 'Clinic'> = ['Home', 'School', 'Clinic'];
  const completionStatuses: Array<'Completed' | 'Abandoned' | 'Interrupted'> = ['Completed', 'Abandoned', 'Interrupted'];
  const devices = ['iPad Pro', 'iPhone 13', 'Android Tablet', 'Samsung Galaxy S21', 'Desktop Computer', 'Laptop'];
  const activityTypes = ['Attention Farming', 'Memory Sequence', 'Card Matching', 'Response Inhibition', 'Task Switching'];
  
  let sessions: SessionData[] = [];
  
  patients.forEach(patient => {
    for (let i = 0; i < sessionsPerPatient; i++) {
      const date = subDays(new Date(), randomInt(1, 90));
      const startTime = format(date, "yyyy-MM-dd'T'HH:mm:ss");
      const durationMinutes = randomInt(15, 45);
      const endTime = format(addMinutes(date, durationMinutes), "yyyy-MM-dd'T'HH:mm:ss");
      
      const activityCount = randomInt(3, 6);
      const activities = Array.from({ length: activityCount }, (_, actIdx) => ({
        id: `ACT${patient.id}-${i}-${actIdx}`,
        type: randomChoice(activityTypes),
        score: randomFloat(50, 98),
        duration: randomInt(2, 10) * 60, // in seconds
        difficulty: randomInt(1, 5)
      }));
      
      const attention = randomFloat(40, 95);
      const memory = randomFloat(40, 95);
      const executiveFunction = randomFloat(40, 95);
      const behavioral = randomFloat(40, 95);
      
      sessions.push({
        id: `S${patient.id}-${i}`,
        patientId: patient.id,
        startTime,
        endTime,
        duration: durationMinutes * 60, // in seconds
        environment: randomChoice(environments),
        completionStatus: randomChoice(completionStatuses),
        overallScore: randomFloat(50, 98),
        device: randomChoice(devices),
        activities,
        domainScores: {
          attention,
          memory,
          executiveFunction,
          behavioral
        }
      });
    }
  });
  
  return sessions;
};

// Generate historical trends for a specific domain
export const generateTrendData = (domain: keyof CognitiveDomain, days: number = 90) => {
  const data = [];
  for (let i = days; i >= 0; i -= randomInt(3, 7)) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    // Add some randomness but ensure an overall improving trend
    const value = randomFloat(50, 85) + ((days - i) / days) * 15;
    data.push({ date, value: Math.min(value, 100) });
  }
  return data;
};

// Generate percentile data for normative comparison
export const generatePercentileData = () => {
  return {
    patient: {
      attention: randomFloat(40, 95),
      memory: randomFloat(40, 95),
      executiveFunction: randomFloat(40, 95),
      behavioral: randomFloat(40, 95)
    },
    ageGroup: {
      attention: randomFloat(45, 55),
      memory: randomFloat(45, 55),
      executiveFunction: randomFloat(45, 55),
      behavioral: randomFloat(45, 55)
    },
    adhdSubtype: {
      attention: randomFloat(35, 45),
      memory: randomFloat(40, 50),
      executiveFunction: randomFloat(30, 45),
      behavioral: randomFloat(35, 45)
    }
  };
};

// Generate recommendations based on patient metrics
export const generateRecommendations = (metrics: PatientMetrics): string[] => {
  const recommendations: string[] = [];
  
  if (metrics.attention < 60) {
    recommendations.push('Implement focused attention exercises for 10-15 minutes daily');
    recommendations.push('Consider environmental modifications to reduce distractions');
  }
  
  if (metrics.memory < 60) {
    recommendations.push('Practice working memory activities using sequential tasks');
    recommendations.push('Use visual aids and memory strategies in daily routines');
  }
  
  if (metrics.executiveFunction < 60) {
    recommendations.push('Introduce planning tools and visual schedules');
    recommendations.push('Break complex tasks into smaller, manageable steps');
  }
  
  if (metrics.behavioral < 60) {
    recommendations.push('Establish consistent behavioral expectations and routines');
    recommendations.push('Implement positive reinforcement strategies for impulse control');
  }
  
  // If no specific concerns or all scores are above threshold
  if (recommendations.length === 0) {
    recommendations.push('Continue current intervention approach as progress is positive');
    recommendations.push('Consider gradually increasing cognitive challenge in future sessions');
  }
  
  return recommendations;
};

// Initialize mock data
export const patients = generatePatients(12);
export const patientMetrics = generatePatientMetrics(patients);
export const sessionData = generateSessionData(patients);

// For convenience, create a map of patient IDs to their metrics
export const metricsMap = patientMetrics.reduce((acc, metrics) => {
  acc[metrics.patientId] = metrics;
  return acc;
}, {} as Record<string, PatientMetrics>);

// For convenience, create a map of patient IDs to their sessions
export const sessionsMap = sessionData.reduce((acc, session) => {
  if (!acc[session.patientId]) {
    acc[session.patientId] = [];
  }
  acc[session.patientId].push(session);
  return acc;
}, {} as Record<string, SessionData[]>);
