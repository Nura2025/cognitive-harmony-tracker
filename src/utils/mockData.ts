
// This file serves as the entry point for mock data
// It initializes and exports all generated mock data

import { 
  Patient, 
  PatientMetrics, 
  SessionData, 
  CognitiveDomain 
} from './types/patientTypes';
import { generatePatients, generatePatientMetrics } from './generators/patientGenerators';
import { generateSessionData } from './generators/sessionGenerators';
import { generateTrendData, generatePercentileData } from './generators/trendGenerators';
import { generateRecommendations } from './generators/recommendationGenerators';

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

// Re-export all types and generator functions
export type { Patient, PatientMetrics, SessionData, CognitiveDomain };
export { 
  generatePatients, 
  generatePatientMetrics, 
  generateSessionData, 
  generateTrendData, 
  generatePercentileData,
  generateRecommendations 
};
