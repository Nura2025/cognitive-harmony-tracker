
// This file serves as the entry point for mock data
// It initializes and exports all generated mock data

import { 
  Patient, 
  PatientMetrics, 
  CognitiveDomain,
  Session,
  Activity
} from '@/types/databaseTypes';
import { generatePatients, generatePatientMetrics } from './generators/patientGenerators';
import { generateSessionData } from './generators/sessionGenerators';
import { generateTrendData, generatePercentileData } from './generators/trendGenerators';
import { generateRecommendations } from './generators/recommendationGenerators';
import { mockPatientData, mockNormativeData, mockSubtypeData } from './mockData/cognitiveDomainData';

// Define an interface that extends Session for frontend components
export interface SessionData extends Session {
  domainScores: {
    attention: number;
    memory: number;
    executiveFunction: number;
    behavioral: number;
  };
  activities: Activity[];
}

// Initialize mock data - make sure we're creating properly structured data
export const patients = generatePatients(12);

export const patientMetrics = generatePatientMetrics(patients);

// Convert session data to SessionData format
export const sessionData: SessionData[] = generateSessionData(patients).map(session => {
  return {
    ...session,
    domainScores: {
      attention: session.attention,
      memory: session.memory,
      executiveFunction: session.executive_function,
      behavioral: session.behavioral
    }
  } as SessionData;
});

// Export mock cognitive domain data
export { mockPatientData, mockNormativeData, mockSubtypeData };

// For convenience, create a map of patient IDs to their metrics
export const metricsMap = patientMetrics.reduce((acc, metrics) => {
  if (!acc[metrics.patient_id]) {
    acc[metrics.patient_id] = metrics;
  }
  return acc;
}, {} as Record<string, PatientMetrics>);

// For convenience, create a map of patient IDs to their sessions
export const sessionsMap = sessionData.reduce((acc, session) => {
  if (!acc[session.patient_id]) {
    acc[session.patient_id] = [];
  }
  acc[session.patient_id].push(session);
  return acc;
}, {} as Record<string, SessionData[]>);

// Re-export all types and generator functions
export { 
  generatePatients, 
  generatePatientMetrics, 
  generateSessionData, 
  generateTrendData, 
  generatePercentileData,
  generateRecommendations 
};
