
// This file serves as the entry point for mock data
// It initializes and exports all generated mock data

import { 
  Patient, 
  PatientMetrics, 
  CognitiveDomain,
  Session
} from '@/types/databaseTypes';
import { generatePatients, generatePatientMetrics } from './generators/patientGenerators';
import { generateSessionData } from './generators/sessionGenerators';
import { generateTrendData, generatePercentileData } from './generators/trendGenerators';
import { generateRecommendations } from './generators/recommendationGenerators';
import { mockPatientData, mockNormativeData, mockSubtypeData } from './mockData/cognitiveDomainData';

// Define a SessionData type that matches what the components expect
export interface SessionData extends CognitiveDomain {
  id: string;
  patientId: string;
  startTime: string;
  endTime: string;
  duration: number;
  environment: 'Home' | 'School' | 'Clinic';
  completionStatus: 'Completed' | 'Abandoned' | 'Interrupted';
  overallScore: number;
  device: string;
  domainScores: {
    attention: number;
    memory: number;
    executiveFunction: number;
    behavioral: number;
  };
  activities: Array<{
    id: string;
    type: string;
    score: number;
    duration: number;
    difficulty: number;
  }>;
}

// Initialize mock data - make sure we're creating properly structured data
export const patients = generatePatients(12).map<Patient>(p => ({
  id: p.id,
  name: p.name,
  age: p.age,
  gender: p.gender as 'Male' | 'Female' | 'Other',
  diagnosis_date: p.diagnosisDate,
  adhd_subtype: p.adhdSubtype as 'Inattentive' | 'Hyperactive-Impulsive' | 'Combined',
  created_at: new Date().toISOString()
}));

export const patientMetrics = generatePatientMetrics(patients).map<PatientMetrics>(pm => ({
  id: `PM-${pm.patientId}`,
  patient_id: pm.patientId,
  date: pm.date,
  attention: pm.attention,
  memory: pm.memory,
  executive_function: pm.executiveFunction,
  behavioral: pm.behavioral,
  percentile: pm.percentile,
  sessions_duration: pm.sessionsDuration,
  sessions_completed: pm.sessionsCompleted,
  progress: pm.progress,
  clinical_concerns: pm.clinicalConcerns,
  created_at: new Date().toISOString()
}));

export const sessionData = generateSessionData(patients).map<SessionData>(session => ({
  id: session.id,
  patientId: session.patientId,
  startTime: session.startTime,
  endTime: session.endTime,
  duration: session.duration,
  environment: session.environment,
  completionStatus: session.completionStatus,
  overallScore: session.overallScore,
  device: session.device,
  attention: session.domainScores.attention,
  memory: session.domainScores.memory,
  executive_function: session.domainScores.executiveFunction,
  behavioral: session.domainScores.behavioral,
  domainScores: session.domainScores,
  activities: session.activities
}));

// Export mock cognitive domain data
export { mockPatientData, mockNormativeData, mockSubtypeData };

// For convenience, create a map of patient IDs to their metrics
export const metricsMap = patientMetrics.reduce((acc, metrics) => {
  acc[metrics.patient_id] = metrics;
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
export { 
  generatePatients, 
  generatePatientMetrics, 
  generateSessionData, 
  generateTrendData, 
  generatePercentileData,
  generateRecommendations 
};
